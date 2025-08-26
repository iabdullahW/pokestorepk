"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiArrowLeft, FiPackage } from "react-icons/fi"
import Navbar from "@/components/layout/Navbar"
import TopBar from "@/components/layout/TopBar"
import ProductCard from "@/components/products/ProductCard"
import Footer from "@/components/layout/Footer"
import Cart from "@/components/cart/Cart"
import type { Product, Category } from "@/types"
import { getProductsByCategory, getCategories } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/layout/Sidebar"
import MidBar from "@/components/layout/MidBar"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categorySlug = params.category as string
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategoryData()
  }, [categorySlug])

  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      // Fetch category details and products in parallel
      const [fetchedCategories, fetchedProducts] = await Promise.all([
        getCategories(),
        getProductsByCategory(categorySlug),
      ])

      // Find the category by slug
      const foundCategory = fetchedCategories.find(cat => cat.slug === categorySlug)

      if (!foundCategory) {
        toast({
          title: "Category Not Found",
          description: "The requested category does not exist.",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      setCategory(foundCategory)
      setProducts(fetchedProducts)

      if (fetchedProducts.length === 0) {
        toast({
          title: "No Products",
          description: `No products available in ${foundCategory.name} category yet.`,
        })
      }
    } catch (error) {
      console.error("Error fetching category data:", error)
      toast({
        title: "Error",
        description: "Failed to load category data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212121]">
        <TopBar />
        <MidBar />
        <Navbar />

        <div className="pt-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#212121]">
        <TopBar />
        <MidBar />
        <Navbar />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
              <p className="text-lg text-gray-600 mb-8">The requested category does not exist.</p>
              <button
                onClick={() => router.push("/")}
                className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#212121] ">
      <TopBar />
      <MidBar />
      <Navbar />
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <div className="relative flex items-center">
              {/* Back Button - Left */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#B56F76] hover:text-rose-600 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
              
              {/* Category Icon and Name - Center */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                  <FiPackage className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold text-white">{category.name}</h1>
              </div>
            </div>
            
            {category.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
                {category.description}
              </p>
            )}
          </motion.div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="w-12 h-12 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
              <p className="text-lg text-gray-200 mb-8">
                We're working hard to bring you amazing {category.name.toLowerCase()} products.
                Check back soon for new arrivals!
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
              >
                Browse Other Categories
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Category Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </div>
              <p className="text-gray-600">
                Available in {category.name} category
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Cart />
      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} categories={[]} user={undefined} />
    </div>
  )
}