"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiX } from "react-icons/fi"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import type { Product, Category } from "@/types"
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories } from "@/lib/firestore"
import { uploadImage, deleteImage } from "@/lib/image-upload"

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  // Initialize form data with default values
  const [formData, setFormData] = useState(() => {
    // Try to get initial category from localStorage or use empty string
    const savedFormData = localStorage.getItem('product-form-data')
    return {
      name: "",
      description: "",
      price: "",
      category: savedFormData ? JSON.parse(savedFormData).category : "",
      image: "",
      stockQuantity: "",
    }
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Only fetch data if we don't have it yet
    if (products.length === 0 || categories.length === 0) {
      fetchData()
    }
    
    // Cleanup function
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [])

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch products and categories in parallel
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories(),
      ])

      setProducts(fetchedProducts)
      setCategories(fetchedCategories)

      // Set default category if available and not already set
      if (fetchedCategories.length > 0 && !formData.category) {
        const savedFormData = localStorage.getItem('product-form-data')
        const savedCategory = savedFormData ? JSON.parse(savedFormData).category : ''
        const defaultCategory = savedCategory || fetchedCategories[0]?.slug || ''
        
        setFormData(prev => ({
          ...prev,
          category: defaultCategory
        }))
      }

      // Only show toast if this is the initial load
      if (products.length === 0 && fetchedProducts.length > 0) {
        toast({
          title: "Products Loaded",
          description: `Successfully loaded ${fetchedProducts.length} products.`,
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data from Firebase.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    }
    setFormData(newFormData)
    // Save form data to localStorage on change
    localStorage.setItem('product-form-data', JSON.stringify(newFormData))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      console.log('Preview URL created:', url)
      setPreviewUrl(url)
      
      // Clear the URL input when file is selected
      setFormData(prev => ({ ...prev, image: "" }))
    }
  }

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file first.",
        variant: "destructive",
      })
      return
    }

    console.log('Starting image upload for file:', selectedFile.name)
    setUploadingImage(true)
    try {
      const result = await uploadImage(selectedFile, "products")
      console.log('Upload result:', result)
      
      if (result.success && result.url) {
        console.log('Image uploaded successfully, URL:', result.url)
        setFormData(prev => ({ ...prev, image: result.url || "" }))
        
        // Show appropriate message based on upload method
        if (result.error && result.error.includes('locally')) {
          toast({
            title: "Success",
            description: "Image uploaded and stored locally! (Firebase Storage CORS issue detected)",
          })
        } else {
          toast({
            title: "Success",
            description: "Image uploaded successfully! URL has been set.",
          })
        }
        
        // Clear file selection and preview
        setSelectedFile(null)
        setPreviewUrl("")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const clearImageSelection = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setFormData(prev => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url) return true // Empty URL is valid (no image)
    
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('Image URL validation failed:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate image URL if provided
    if (formData.image && !formData.image.startsWith('blob:')) {
      const isValidImage = await validateImageUrl(formData.image)
      if (!isValidImage) {
        toast({
          title: "Warning",
          description: "The provided image URL may not be accessible. Please check the URL or upload an image file.",
          variant: "destructive",
        })
        return
      }
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        inStock: parseInt(formData.stockQuantity) > 0,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
      }

      if (editingProduct) {
        // Update existing product
        const success = await updateProduct(editingProduct.id, productData)
        if (success) {
          // If the image URL changed and the old image was from our storage, delete it
          if (editingProduct.image !== productData.image && 
              editingProduct.image && 
              editingProduct.image.includes('firebasestorage.app')) {
            try {
              await deleteImage(editingProduct.image)
            } catch (imageError) {
              console.warn("Failed to delete old image from storage:", imageError)
              // Don't fail the product update if image deletion fails
            }
          }
          
          const updatedProducts = products.map((product) =>
            product.id === editingProduct.id ? { ...product, ...productData } : product
          )
          setProducts(updatedProducts)

          toast({
            title: "Success",
            description: "Product updated successfully in Firebase.",
          })
        } else {
          throw new Error("Failed to update product")
        }
      } else {
        // Add new product
        const productId = await addProduct(productData)
        if (productId) {
          const newProduct = { ...productData, id: productId }
          setProducts([newProduct, ...products])

          toast({
            title: "Success",
            description: "Product added successfully to Firebase.",
          })
        } else {
          throw new Error("Failed to add product")
        }
      }

      // Reset form
      setFormData({ name: "", description: "", price: "", category: categories.length > 0 ? categories[0].slug : "", image: "", stockQuantity: "" })
      setSelectedFile(null)
      setPreviewUrl("")
      setShowAddForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product to Firebase.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stockQuantity: product.stockQuantity?.toString() || "0",
    })
    setSelectedFile(null)
    setPreviewUrl("")
    setShowAddForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        // Find the product to get its image URL
        const product = products.find((p) => p.id === productId)
        
        const success = await deleteProduct(productId)
        if (success) {
          // Try to delete the image from storage if it exists and is from our storage
          if (product?.image && product.image.includes('firebasestorage.app')) {
            try {
              await deleteImage(product.image)
            } catch (imageError) {
              console.warn("Failed to delete image from storage:", imageError)
              // Don't fail the product deletion if image deletion fails
            }
          }
          
          const updatedProducts = products.filter((p) => p.id !== productId)
          setProducts(updatedProducts)

          toast({
            title: "Success",
            description: "Product deleted successfully from Firebase.",
          })
        } else {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product from Firebase.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-black flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Product Management</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Firebase Connected - Changes are saved to database</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-rose-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No categories available. Please add categories first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                {/* File Input */}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border bg-black border-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiUpload className="w-4 h-4" />
                    Choose Image
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={clearImageSelection}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                {/* File Info */}
                {selectedFile && (
                  <div className="text-sm text-gray-600">
                    <p>Selected: {selectedFile.name}</p>
                    <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                {/* Preview */}
                {(previewUrl || formData.image) && (
                  <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl || formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onLoad={() => console.log('Preview image loaded successfully:', previewUrl || formData.image)}
                      onError={(e) => {
                        console.error('Preview image failed to load:', previewUrl || formData.image)
                        // Fallback to a placeholder
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span class="text-gray-400 text-sm">Preview Error</span>
                            </div>
                          `
                        }
                      }}
                    />
                  </div>
                )}

                {/* Upload Button */}
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white "></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-4 h-4 " />
                        Upload Image
                      </>
                    )}
                  </button>
                )}

                {/* URL Input (fallback) */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Or enter image URL:</p>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="bg-rose-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProduct(null)
                  setFormData({ name: "", description: "", price: "", category: categories.length > 0 ? categories[0].slug : "", image: "", stockQuantity: "" })
                  setSelectedFile(null)
                  setPreviewUrl("")
                }}
                className="bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-6 py-8 text-center text-gray-500">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onLoad={() => console.log('Product image loaded successfully:', product.image)}
                              onError={(e) => {
                                console.error('Product image failed to load:', product.image)
                                // Hide the image and show fallback
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <span class="text-gray-400 text-xs">${product.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                  `
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">{product.name.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs{product.price}</td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${
                        (product.stockQuantity || 0) > 10 ? "text-green-600" :
                        (product.stockQuantity || 0) > 0 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {product.stockQuantity || 0} units
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (product.stockQuantity || 0) > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(product.stockQuantity || 0) > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
