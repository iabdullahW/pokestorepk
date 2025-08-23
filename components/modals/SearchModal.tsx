"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiX, FiPackage } from "react-icons/fi"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getProducts } from "@/lib/firestore"
import type { Product } from "@/types"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
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
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery("")
    setFilteredProducts([])
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose()
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-4 sm:top-8 md:top-16 lg:top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-auto sm:max-w-2xl bg-[#212121] rounded-xl sm:rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-8rem)] flex flex-col text-white"
          >
            {/* Search Header */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products, descriptions, or categories..."
                  className="flex-1 text-sm sm:text-base md:text-lg outline-none text-[#B56F76] placeholder-gray-400 bg-transparent min-w-0"
                  autoFocus
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearSearch}
                    className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-rose-200 transition-colors flex-shrink-0"
                  >
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <FiX className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[black]" />
                </motion.button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 min-h-0">
              {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                  <span className="ml-2 sm:ml-3 text-gray-600 text-sm sm:text-base">Loading products...</span>
                </div>
              ) : searchQuery.trim() ? (
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#B56F76]">
                      Search Results
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {searching ? "Searching..." : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
                    </span>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <FiPackage className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base md:text-lg">No products found</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2">
                        Try searching with different keywords
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-rose-50 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#B56F76] truncate text-xs sm:text-sm md:text-base">
                              {product.name}
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 hidden sm:block">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1 sm:mt-2">
                              <span className="text-sm sm:text-lg font-bold gradient-text">
                                Rs{product.price}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <FiPackage className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-rose-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <FiSearch className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base md:text-lg">Start typing to search</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">
                    Search by product name, description, or category
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 sm:p-3 md:p-4 border-t border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 flex-shrink-0">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
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
