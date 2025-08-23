"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiX, FiPackage } from "react-icons/fi"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getProducts } from "@/lib/firestore"
import type { Product } from "@/types"

interface ProductSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductSearch({ isOpen, onClose }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Load all products on mount
  useEffect(() => {
    if (isOpen) {
      loadProducts()
      // Focus search input when modal opens
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([])
      return
    }

    setSearching(true)
    const query = searchQuery.toLowerCase().trim()
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )

    setFilteredProducts(filtered)
    setSearching(false)
  }, [searchQuery, products])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const allProducts = await getProducts()
      setProducts(allProducts)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products for search",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`)
    onClose()
    setSearchQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilteredProducts([])
    searchInputRef.current?.focus()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-playfair text-2xl font-bold text-[#B56F76]">Search Products</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-rose-200 transition-colors"
                >
                  <FiX className="w-6 h-6 text-[#B56F76]" />
                </motion.button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products, descriptions, or categories..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  <span className="ml-3 text-gray-600">Loading products...</span>
                </div>
              ) : searchQuery.trim() ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#B56F76]">
                      Search Results
                    </h3>
                    <span className="text-sm text-gray-500">
                      {searching ? "Searching..." : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
                    </span>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No products found</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Try searching with different keywords
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#B56F76] truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold gradient-text">
                                Rs{product.price}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <FiPackage className="w-5 h-5 text-rose-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Start typing to search</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Search by product name, description, or category
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Press ESC to close</span>
                <span>{products.length} total products</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 