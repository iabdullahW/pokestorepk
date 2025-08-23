"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Product, Category } from "@/types"
import { getProductsByCategory, getCategories } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/products/ProductCard"

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({})
  // Use a simple object for expanded state instead of Set for better React state updates
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getCategories()
        const allowed = ["Booster", "Blister", "PSA", "RAW Cards"]
        const filtered = all.filter((c) => allowed.includes(c.name))
        setCategories(filtered)

        // fetch products for each category
        const productsByCategory: Record<string, Product[]> = {}
        for (const cat of filtered) {
          const prods = await getProductsByCategory(cat.slug)
          productsByCategory[cat.slug] = prods
        }
        setCategoryProducts(productsByCategory)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: "Error",
          description: "Could not load categories/products",
          variant: "destructive",
        })
      } finally {
        setIsMounted(true)
      }
    }
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchData()
    } else {
      // On server side, set isMounted to true to avoid hydration mismatch
      setIsMounted(true)
    }
  }, [toast])

  const toggleCategoryExpansion = (categorySlug: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }));
  }

  // NEW: Handle category card click to navigate to products page with category filter
  const handleCategoryCardClick = (categorySlug: string) => {
    router.push(`/products?category=${categorySlug}`)
  }

  const getDisplayedProducts = (categorySlug: string) => {
    const products = categoryProducts[categorySlug] || [];
    const isExpanded = !!expandedCategories[categorySlug];
    return isExpanded ? products : products.slice(0, 4);
  }

  const shouldShowViewAll = (categorySlug: string) => {
    const products = categoryProducts[categorySlug] || [];
    return products.length > 4 && !expandedCategories[categorySlug];
  }

  const shouldShowViewLess = (categorySlug: string) => {
    const products = categoryProducts[categorySlug] || [];
    return products.length > 4 && !!expandedCategories[categorySlug];
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Memoize the product cards to prevent unnecessary re-renders
  const renderProductCards = (categorySlug: string) => {
    const products = getDisplayedProducts(categorySlug);
    return products.map((product) => (
      <motion.div key={product.id} variants={itemVariants}>
        <ProductCard
          product={product}
          className="w-full"
          onAddToCart={() => {}}
        />
      </motion.div>
    ));
  };

  // Show loading state during initial render
  if (!isMounted || !categories.length) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-rose-600" />
      </div>
    )
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1f1f1f] to-[#121212]">
      <div className="max-w-7xl mx-auto">
        {/* All products button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push("/products")}
            className=" bg-gray-600 text-white px-4 py-2 rounded-[9px]"
          >
            All products
          </button>
        </div>
      </div>

      <div className="w-full px-4 max-w-7xl mx-auto">
        {/* Category cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-3 mb-12"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCategoryCardClick(category.slug)}
              className="cursor-pointer rounded-[14px] border border-[#212121] bg-white text-center overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative w-full pt-[100%] bg-cover bg-center">
                <img
                  src="/boost.webp"
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                {category.name === "Booster" && (
                  <div className="absolute top-2 right-2 bg-gradient-to-t from-[#212121] to-[#444444] text-white px-2 py-1 rounded-full text-sm font-bold">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-[#212121] text-3xl mb-4 font-bold">
                  {category.name}
                </h3>
                <button 
                  className="py-2 px-3 bg-[#212121] hover:bg-[#444444] font-bold text-white rounded-[10px]"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent double navigation
                    handleCategoryCardClick(category.slug)
                  }}
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Products grouped by category */}
        {categories.map((category) => (
          <div key={category.id} className="mb-16">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 flex justify-center">
              {category.name}
            </h2>

            {categoryProducts[category.slug]?.length ? (
              <>
                <motion.div
                  key={`products-${category.slug}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
                >
                  {renderProductCards(category.slug)}
                </motion.div>

                {/* View All / View Less button */}
                <div className="flex justify-center mt-8">
                  {shouldShowViewAll(category.slug) && (
                    <button
                      onClick={() => toggleCategoryExpansion(category.slug)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-[9px] transition-colors duration-300"
                    >
                      View All Products ({categoryProducts[category.slug].length})
                    </button>
                  )}
                  {shouldShowViewLess(category.slug) && (
                    <button
                      onClick={() => toggleCategoryExpansion(category.slug)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-[9px] transition-colors duration-300"
                    >
                      View Less
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-400 flex justify-center">No products found.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}