import { initializeFirebase, getFirebaseServices } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { signInAnonymously } from "firebase/auth"

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Helper function to validate image URL
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    return true
  } catch (error) {
    console.warn('Image URL validation failed:', error)
    return false
  }
}

// Helper function to convert file to base64 for fallback
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Helper function to compress image before upload (max 800x800, 80% quality)
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      const maxSize = 800
      let { width, height } = img
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }))
          } else {
            resolve(file)
          }
        },
        file.type,
        0.8
      )
    }
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

// Cloudinary upload (primary)
const uploadToCloudinary = async (file: File, folder: string): Promise<UploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', `pokemonstorepk/${folder}`)
  formData.append('quality', 'auto')
  formData.append('fetch_format', 'auto')

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`)
  }
  const result = await response.json()
  if (result.error) {
    throw new Error(result.error.message)
  }
  return { success: true, url: result.secure_url }
}

// Firebase Storage upload (secondary)
const uploadToFirebase = async (file: File, folder: string): Promise<UploadResult> => {
  await initializeFirebase()
  const services = getFirebaseServices()
  if (!services?.storage) throw new Error('Firebase Storage not available')
  const { storage, auth } = services
  try {
    if (auth && !auth.currentUser) {
      await signInAnonymously(auth)
    }
  } catch {}
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const storageRef = ref(storage, `${folder}/${fileName}`)
  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  return { success: true, url: downloadURL }
}

export const uploadImage = async (file: File, folder: string = "products"): Promise<UploadResult> => {
  console.log('🚀 Starting image upload for file:', file.name, 'Size:', file.size, 'Type:', file.type)

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'File must be an image' }
  }
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { success: false, error: 'File size must be less than 10MB' }
  }

  try {
    // Compress first
    console.log('🗜️ Compressing image...')
    const compressed = await compressImage(file)
    console.log('✅ Image compressed from', file.size, 'to', compressed.size, 'bytes')

    // Strategy 1: Cloudinary
    try {
      console.log('📤 Trying Cloudinary upload...')
      const res = await uploadToCloudinary(compressed, folder)
      console.log('✅ Cloudinary upload successful:', res.url)
      return res
    } catch (e) {
      console.warn('⚠️ Cloudinary upload failed:', e)
    }

    // Strategy 2: Firebase Storage
    try {
      console.log('📁 Trying Firebase Storage upload...')
      const res = await uploadToFirebase(compressed, folder)
      console.log('✅ Firebase Storage upload successful:', res.url)
      return res
    } catch (e) {
      console.warn('⚠️ Firebase Storage upload failed:', e)
    }

    // Strategy 3: Base64 fallback
    console.log('📦 Using base64 fallback...')
    const base64 = await fileToBase64(compressed)
    console.log('✅ Base64 conversion successful')
    return {
      success: true,
      url: base64,
      error: 'Using base64 storage - consider setting up Cloudinary for better performance.'
    }
  } catch (error) {
    console.error('❌ All upload methods failed:', error)
    return { success: false, error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Firebase Storage URLs
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      await initializeFirebase()
      const services = getFirebaseServices()
      if (services?.storage) {
        const url = new URL(imageUrl)
        const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0])
        const imageRef = ref(services.storage, path)
        await deleteObject(imageRef)
        console.log('✅ Firebase Storage image deleted')
        return true
      }
    }

    // Cloudinary URLs (requires admin API to truly delete; acknowledge and skip)
    if (imageUrl.includes('cloudinary.com')) {
      console.log('ℹ️ Cloudinary image - deletion requires admin API (not available client-side)')
      return true
    }

    // Base64 images (embedded)
    if (imageUrl.startsWith('data:image/')) {
      console.log('ℹ️ Base64 image - no deletion needed')
      return true
    }

    console.log('ℹ️ External URL - no deletion needed')
    return true
  } catch (error) {
    console.error('❌ Failed to delete image:', error)
    return false
  }
}