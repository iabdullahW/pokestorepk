'use client'

import { useState } from 'react'
import { uploadImage, validateImageUrl } from '@/lib/image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FiUpload, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'
import Image from 'next/image'

export default function ImageUploadTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [validationResult, setValidationResult] = useState<string>('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type)
      setSelectedFile(file)
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadResult(null)

    try {
      console.log('Starting upload test...')
      const result = await uploadImage(selectedFile, 'uploads')
      console.log('Upload result:', result)
      setUploadResult(result)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlValidation = async () => {
    if (!imageUrl) return

    setValidationResult('Validating...')
    try {
      const isValid = await validateImageUrl(imageUrl)
      setValidationResult(isValid ? 'URL is accessible' : 'URL validation failed')
    } catch (error) {
      setValidationResult('Validation error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const clearResults = () => {
    setSelectedFile(null)
    setImageUrl('')
    setUploadResult(null)
    setValidationResult('')
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUpload className="w-5 h-5" />
            Image Upload Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Test */}
          <div className="space-y-2">
            <h3 className="font-medium">Test File Upload</h3>
            <div className="flex gap-2">
              <Input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* URL Validation Test */}
          <div className="space-y-2">
            <h3 className="font-medium">Test URL Validation</h3>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleUrlValidation}
                disabled={!imageUrl}
                variant="outline"
              >
                Validate
              </Button>
            </div>
            {validationResult && (
              <p className="text-sm text-gray-600">{validationResult}</p>
            )}
          </div>

          {/* Results */}
          {uploadResult && (
            <Alert className={uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {uploadResult.success ? (
                  <FiCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription className={uploadResult.success ? 'text-green-800' : 'text-red-800'}>
                  {uploadResult.success ? (
                    <div>
                      <p className="font-medium">Upload successful!</p>
                      <p className="text-sm mt-1">URL: {uploadResult.url}</p>
                      {uploadResult.url?.startsWith('data:image/') && (
                        <p className="text-xs mt-1 text-green-600">(Stored as base64 fallback)</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Upload failed</p>
                      <p className="text-sm mt-1">{uploadResult.error}</p>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Image Preview */}
          {uploadResult?.success && uploadResult.url && (
            <div className="space-y-2">
              <h3 className="font-medium">Preview</h3>
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                <Image
                  src={uploadResult.url}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  onLoad={() => console.log('Test image loaded successfully')}
                  onError={(e) => {
                    console.error('Test image failed to load')
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400 text-xs">Error</span></div>'
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Clear Button */}
          <Button onClick={clearResults} variant="outline" className="w-full">
            <FiX className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 