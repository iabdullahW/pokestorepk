"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { FiArrowLeft, FiHeart, FiShoppingCart, FiStar,FiZap } from "react-icons/fi"
import Navbar from "@/components/layout/Navbar"
import TopBar from "@/components/layout/TopBar"
import Footer from "@/components/layout/Footer"
import Cart from "@/components/cart/Cart"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"
import { getProductById } from "@/lib/firestore"
import Sidebar from "@/components/layout/Sidebar"
import type { Product } from "@/types"
import MidBar from "@/components/layout/MidBar"
import ReviewsSection from "@/components/sections/ReviewsSection"
import WhiteReview from "@/components/sections/WhiteReview"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const { addToCart, toggleCart } = useCart()
  const { toast } = useToast()

  // Discount calculation function - only for booster categories
  const getDiscountInfo = (qty: number, basePrice: number, category: string) => {
    // Only apply discounts for booster categories
    if (category !== "booster") {
      return {
        discount: 0,
        discountedPrice: basePrice * qty,
        originalPrice: basePrice * qty,
        savings: 0,
        label: "Standard",
        description: "Standard price"
      }
    }

    if (qty >= 5) {
      return {
        discount: 15,
        discountedPrice: basePrice * qty * 0.85,
        originalPrice: basePrice * qty,
        savings: basePrice * qty * 0.15,
        label: "Five Packs",
        description: "You save 15%"
      }
    } else if (qty >= 3) {
      return {
        discount: 10,
        discountedPrice: basePrice * qty * 0.90,
        originalPrice: basePrice * qty,
        savings: basePrice * qty * 0.10,
        label: "Three Packs",
        description: "You save 10%"
      }
    } else {
      return {
        discount: 0,
        discountedPrice: basePrice * qty,
        originalPrice: basePrice * qty,
        savings: 0,
        label: "One Pack",
        description: "Standard price"
      }
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const foundProduct = await getProductById(productId)

      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        console.error("Product not found:", productId)
        toast({
          title: "Product Not Found",
          description: "The product you're looking for doesn't exist.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (product) {
      // Check stock availability
      if ((product.stockQuantity || 0) < quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stockQuantity || 0} items available in stock.`,
          variant: "destructive",
        })
        return
      }
      
      try {
        for (let i = 0; i < quantity; i++) {
          await addToCart(product)
        }
        toast({
          title: "Added to cart!",
          description: `${quantity} x ${product.name} added to your cart.`,
        })
      } catch (error) {
        console.error("Error adding to cart:", error)
      }
    }
  }

  // New Buy Now function
  const handleBuyNow = async () => {
    if (product) {
      // Check stock availability
      if ((product.stockQuantity || 0) < quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stockQuantity || 0} items available in stock.`,
          variant: "destructive",
        })
        return
      }
      
      try {
        // Add items to cart
        for (let i = 0; i < quantity; i++) {
          await addToCart(product)
        }
        
        // Show success toast
        toast({
          title: "Added to cart!",
          description: `${quantity} x ${product.name} ready for checkout.`,
        })
        
        // Open cart sidebar automatically
        toggleCart()
        
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast({
          title: "Error",
          description: "Failed to add product to cart.",
          variant: "destructive",
        })
      }
    }
  }


  const handleImageSelect = (index: number) => {
    setImageLoading(true)
    setSelectedImage(index)
  }

  // Define different angles/transformations for each image
  const getImageTransform = (index: number) => {
    const transforms = [
      'rotate(0deg) scale(1)', // Default view
      'rotate(-2deg) scale(1.02)', // Slight left tilt with zoom
      'rotate(1deg) scale(1.01)', // Slight right tilt with zoom
    ]
    return transforms[index] || transforms[0]
  }

  const getImageFilter = (index: number) => {
    const filters = [
      'none', // Original
      'brightness(1.05) contrast(1.1)', // Brighter
      'brightness(0.95) saturate(1.2)', // More saturated
    ]
    return filters[index] || filters[0]
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <MidBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
        <Footer />
        <Cart />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <MidBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#B56F76] mb-4">Product Not Found</h1>
            <button onClick={() => router.back()} className="text-rose-500 hover:text-rose-600 transition-colors">
              ← Go Back
            </button>
          </div>
        </div>
        <Footer />
        <Cart />
      </main>
    )
  }

  const productImages = [
    product.image,
    product.image?.replace("400", "401") || "/placeholder.svg?height=400&width=401",
    product.image?.replace("400", "402") || "/placeholder.svg?height=400&width=402",
  ]

  return (
    <main className="min-h-screen">
      <TopBar />
      <MidBar />
      <Navbar />

      <section className="py-4 sm:py-8 lg:py-20 px-4 bg-[#212121] text-white">
        <div className="max-w-7xl mx-auto mt-11">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#ffffff] hover:text-rose-600 transition-colors mb-2 "
          >
            <FiArrowLeft className="w-4 h-4 underline" />
            Back to Products
          </motion.button>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 ">
            {/* Product Images will be displayed on top in mobile devices */}
            <div>
              <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              {/* Main Image Container - Fixed for all devices */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-4 bg-gray-100 max-w-[500px] mx-auto lg:mx-0">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  </div>
                )}
                <motion.div
                  key={selectedImage}
                  className="w-full h-full relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: imageLoading ? 0 : 1,
                    scale: 1,
                    transform: getImageTransform(selectedImage)
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  style={{
                    filter: getImageFilter(selectedImage)
                  }}
                >
                  <Image
                    src={productImages[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 500px"
                    priority={selectedImage === 0}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    quality={90}
                  />
                </motion.div>
              </div>

              {/* Thumbnail Images - Responsive */}
              <div className="flex gap-2 sm:gap-3 justify-center lg:justify-start overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                        ? "border-rose-500 shadow-lg ring-2 ring-rose-200"
                        : "border-gray-200 hover:border-rose-300"
                      }`}
                    whileHover={{ scale: selectedImage === index ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      quality={75}
                    />
                    {/* Selected Indicator with animation */}
                    {selectedImage === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Image indicator text */}
              <div className="text-center lg:text-left mt-2">
                <p className="text-xs sm:text-sm text-white">
                  View {selectedImage + 1} of {productImages.length}
                </p>
              </div>
            </motion.div>
            </div>
            {/* in phone it will be displayed below image */}
            <div className="space-y-6 order-1 lg:order-2 sm:bg-black p-4 rounded-[10px]">
              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 sm:space-y-6 order-1 lg:order-2"
              >
                <div>
                  <span className="inline-block px-3 py-1 bg-[white] text-black text-sm font-medium rounded-full mb-3 sm:mb-4">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                  <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#ffffff] mb-3 sm:mb-4 leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-white">(4.9) 127 reviews</span>
                  </div>

                  {/* Updated Price Display with Discount */}
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-4 sm:mb-6">
                    {product.category === "booster" && quantity > 1 ? (
                      <div className="space-y-1">
                        <div>Rs.{getDiscountInfo(quantity, product.price, product.category).discountedPrice.toFixed(2)}</div>
                        <div className="text-base text-gray-400 line-through">
                          Rs.{getDiscountInfo(quantity, product.price, product.category).originalPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Save Rs.{getDiscountInfo(quantity, product.price, product.category).savings.toFixed(2)} ({getDiscountInfo(quantity, product.price, product.category).discount}% off)
                        </div>
                      </div>
                    ) : (
                      <div>Rs.{(product.price * quantity).toFixed(2)}</div>
                    )}
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-rose-300 flex items-center justify-center hover:bg-gray-700 transition-colors text-lg font-medium"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min((product.stockQuantity || 0), quantity + 1))}
                        disabled={(product.stockQuantity || 0) <= quantity}
                        className="w-10 h-10 rounded-full border border-rose-300 flex items-center justify-center hover:bg-gray-700 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-2">
                      <span className={`text-sm ${
                        (product.stockQuantity || 0) > 10 ? "text-green-400" :
                        (product.stockQuantity || 0) > 0 ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {(product.stockQuantity || 0) > 0 ? `${product.stockQuantity} items available` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                 {/* Updated Button Section with Buy Now */}
                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: (product.stockQuantity || 0) > 0 ? 1.02 : 1 }}
                      whileTap={{ scale: (product.stockQuantity || 0) > 0 ? 0.98 : 1 }}
                      onClick={handleAddToCart}
                      disabled={(product.stockQuantity || 0) < 1}
                      className={`flex-1 bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
                        (product.stockQuantity || 0) > 0
                          ? "shadow-clean-dark hover:shadow-clean-dark border-transparent hover:border-rose-200 cursor-pointer"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500"
                      }`}
                    >
                      <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">{(product.stockQuantity || 0) > 0 ? "Add to Cart" : "Out of Stock"}</span>
                      <span className="sm:hidden">{(product.stockQuantity || 0) > 0 ? "Add" : "N/A"}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: (product.stockQuantity || 0) > 0 ? 1.02 : 1 }}
                      whileTap={{ scale: (product.stockQuantity || 0) > 0 ? 0.98 : 1 }}
                      onClick={handleBuyNow}
                      disabled={(product.stockQuantity || 0) < 1}
                      className={`flex-1 px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                        (product.stockQuantity || 0) > 0
                          ? "bg-white text-[#212121] shadow-lg hover:shadow-xl hover:bg-gray-200 cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiZap className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">{(product.stockQuantity || 0) > 0 ? "Buy Now" : "Unavailable"}</span>
                      <span className="sm:hidden">{(product.stockQuantity || 0) > 0 ? "Buy" : "N/A"}</span>
                    </motion.button>
                  </div>
                </div>
{/* Buy More & Save - Discount Section - Only for non-booster products */}
{product.category == "booster" && (
<div className="text-white rounded-xl p-4 sm:p-6 space-y-4">
  <h3 className="font-bold text-lg mb-3 text-center">Buy More & Save</h3>

  {/* One Pack */}
  <div
    onClick={() => setQuantity(1)}
    className={`flex items-center justify-between p-3 rounded-[12px] border-2 cursor-pointer transition-all duration-200 ${
      quantity === 1 ? "bg-white shadow-md" : "text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      {/* Radio circle */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          quantity === 1 ? "border-black" : "border-gray-300"
        }`}
      >
        {quantity === 1 && (
          <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
        )}
      </div>

      {/* Text */}
      <div>
        <div
          className={`font-medium ${
            quantity === 1 ? "text-black" : "text-[#868686]"
          }`}
        >
          <span className="text-rose-500">One</span> Pack
        </div>
        <div
          className={`text-sm ${
            quantity === 1 ? "text-black" : "text-[#868686]"
          }`}
        >
          Standard price
        </div>
      </div>
    </div>

    {/* Price */}
    <div className="text-right">
      <div
        className={`font-bold ${
          quantity === 1 ? "text-black" : "text-[#868686]"
        }`}
      >
        Rs.{product.price}.00
      </div>
    </div>
  </div>

  {/* Three Packs */}
  <div
    onClick={() => setQuantity(3)}
    className={`flex items-center justify-between p-3 rounded-[12px] border-2 cursor-pointer transition-all duration-200 ${
      quantity === 3 ? "bg-white shadow-md" : "text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          quantity === 3 ? "border-black" : "border-gray-300"
        }`}
      >
        {quantity === 3 && (
          <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
        )}
      </div>
      <div>
        <div
          className={`font-medium ${
            quantity === 3 ? "text-black" : "text-[#868686]"
          }`}
        >
          <span className="text-rose-500">Three</span> Packs
        </div>
        <div
          className={`text-sm ${
            quantity === 3 ? "text-black" : "text-[#868686]"
          }`}
        >
          You save 10%
        </div>
      </div>
    </div>
    <div className="text-right">
      <div
        className={`font-bold ${
          quantity === 3 ? "text-black" : "text-[#868686]"
        }`}
      >
        Rs.{(product.price * 3 * 0.9).toFixed(2)}
      </div>
      <div className="text-xs text-gray-500 line-through">
        Rs.{(product.price * 3).toFixed(2)}
      </div>
    </div>
  </div>

  {/* Five Packs */}
  <div
    onClick={() => setQuantity(5)}
    className={`flex items-center justify-between p-3 rounded-[12px] border-2 cursor-pointer transition-all duration-200 ${
      quantity === 5 ? "bg-white shadow-md" : "text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          quantity === 5 ? "border-black" : "border-gray-300"
        }`}
      >
        {quantity === 5 && (
          <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
        )}
      </div>
      <div>
        <div
          className={`font-medium ${
            quantity === 5 ? "text-black" : "text-[#868686]"
          }`}
        >
          <span className="text-rose-500">Five</span> Packs
        </div>
        <div
          className={`text-sm ${
            quantity === 5 ? "text-black" : "text-[#868686]"
          }`}
        >
          You save 15%
        </div>
      </div>
    </div>
    <div className="text-right">
      <div
        className={`font-bold ${
          quantity === 5 ? "text-black" : "text-[#868686]"
        }`}
      >
        Rs.{(product.price * 5 * 0.85).toFixed(2)}
      </div>
      <div className="text-xs text-gray-500 line-through">
        Rs.{(product.price * 5).toFixed(2)}
      </div>
    </div>
  </div>
</div>
)}

                <div>
                  <h3 className="font-semibold text-[#ffffff] mb-2 sm:mb-3 text-base sm:text-lg">Description</h3>
                  <p className="text-white leading-relaxed text-sm sm:text-base">{product.description}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <ReviewsSection />
      <WhiteReview />
      <Footer />
      <Cart />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} categories={[]} user={undefined} />
    </main>
  )
}