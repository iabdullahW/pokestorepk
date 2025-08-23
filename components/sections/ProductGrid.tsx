"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProductCard from "@/components/products/ProductCard"
import type { Product, Category } from "@/types"
import { getProducts, getProductsByCategory, getCategories } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  /* --- data fetching logic with URL parameter handling --- */
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Check for category parameter in URL
    const categoryParam = searchParams.get('category')
    // IMPORTANT: Do not call handleCategoryChange here (it updates the URL),
    // or we can get a replace -> params change -> effect -> replace loop.
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
      setLoading(true)
      getProductsByCategory(categoryParam)
        .then((categoryProducts) => setProducts(categoryProducts))
        .catch((error) => {
          console.error("Error fetching category products via URL param:", error)
          toast({
            title: "Error",
            description: "Failed to load category products.",
            variant: "destructive",
          })
        })
        .finally(() => setLoading(false))
    } else if (!categoryParam && selectedCategory !== "all") {
      // If URL removed the category, reset to all
      setSelectedCategory("all")
      fetchProducts()
    }
  }, [searchParams])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(fetchedProducts)
      setCategories(fetchedCategories)
      
      // Check if there's a category parameter in the URL after data is loaded
      const categoryParam = searchParams.get('category')
      if (categoryParam) {
        // Verify the category exists before setting it
        const categoryExists = fetchedCategories.some(cat => cat.slug === categoryParam)
        if (categoryExists) {
          setSelectedCategory(categoryParam)
          const categoryProducts = await getProductsByCategory(categoryParam)
          setProducts(categoryProducts)
        }
      }
      
      if (fetchedProducts.length === 0) {
        toast({
          title: "No Products",
          description: "No products available at the moment. Please check back later.",
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = async (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    
    // Update URL without page refresh
    const url = new URL(window.location.href)
    if (categorySlug === "all") {
      url.searchParams.delete('category')
    } else {
      url.searchParams.set('category', categorySlug)
    }
    const nextPathSearch = url.pathname + url.search
    const currentPathSearch = window.location.pathname + window.location.search
    // Guard: avoid redundant replace that can cause re-render loops
    if (nextPathSearch !== currentPathSearch) {
      router.replace(nextPathSearch, { scroll: false })
    }
    
    if (categorySlug === "all") {
      await fetchProducts()
    } else {
      setLoading(true)
      try {
        const categoryProducts = await getProductsByCategory(categorySlug)
        setProducts(categoryProducts)
      } catch (error) {
        console.error("Error fetching category products:", error)
        toast({
          title: "Error",
          description: "Failed to load category products.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  /* --- motion variants unchanged --- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-24 ">
        <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-b-2 border-rose-600"></div>
      </div>
    )
  }

  return (
    <section id="products" className=" bg-[#212121] py-6 sm:py-8 md:py-12 lg:py-16 min-h-screen w-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8">
    

        {/* Category Filter */}
       {/* CATEGORY FILTER – Ultra-premium glass pill */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: true }}
  className="flex justify-center mb-6 sm:mb-8 md:mb-12"
>
  <div
    className="inline-flex flex-wrap justify-center gap-1.5 sm:gap-2 rounded-full
                backdrop-blur-xl p-1.5 sm:p-2
               shadow-[0_8px_32px_rgba(0,0,0,.12)]
               border border-white/20 bg-gradient-to-t from-[#212121] to-[#444444] p-2"
  >
    {/* "All" button */}
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleCategoryChange("all")}
      className={`relative rounded-full px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-bold
                  transition-all duration-300 ease-out overflow-hidden
                  before:absolute before:inset-0 before:rounded-full
                  before:transition-all before:duration-500
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                  ${
                    selectedCategory === "all"
                      ? "text-white bg-[#212121] shadow-[0_6px_20px_rgba(33,33,33,.4)]"
                      : "text-[#212121] bg-white/80 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,.08)]"
                  }`}
    >
      <span className="relative z-10">All</span>
    </motion.button>

    {/* Category buttons */}
    {categories.map((category) => (
      <motion.button
        key={category.id}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleCategoryChange(category.slug)}
        className={`relative rounded-full px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-bold
                    transition-all duration-300 ease-out overflow-hidden
                    before:absolute before:inset-0 before:rounded-full
                    before:transition-all before:duration-500
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                    ${
                      selectedCategory === category.slug
                        ? "text-white bg-[#212121] shadow-[0_6px_20px_rgba(33,33,33,.4)]"
                        : "text-[#212121] bg-white/80 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,.08)]"
                    }`}
      >
        <span className="relative z-10">{category.name}</span>
      </motion.button>
    ))}
  </div>
</motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 md:py-20"
          >
            <p className="text-rose-600 text-base sm:text-lg md:text-xl">
              {selectedCategory === "all"
                ? "No products available at the moment."
                : `No products found in ${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory
                } category.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}