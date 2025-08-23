"use client"

import { motion } from "framer-motion"
import { FiArrowLeft, FiStar, FiHeart, FiMessageCircle } from "react-icons/fi"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import TopBar from "@/components/layout/TopBar"
import MidBar from "@/components/layout/MidBar"

// Sample review data - replace with your actual review screenshots
const reviewScreenshots = [
  {
    id: 1,
    image: "/reviews/rev1.jpg", // Replace with actual review screenshot
    customer: "Sarah Aftab",
    rating: 5,
    product: "Booster",
    date: "2024-04-15",
    featured: true
  },
  {
    id: 2,
    image: "/reviews/rev2.jpg", // Replace with actual review screenshot
    customer: "ilsa",
    rating: 5,
    product: "PSA",
    date: "2024-11-12",
    
  },
  {
    id: 3,
    image: "/reviews/rev3.jpg", // Replace with actual review screenshot
    customer: "Hafsa",
    rating: 5,
    product: "Blisters",
    date: "2024-08-10",
    featured: false
  },
  {
    id: 4,
    image: "/reviews/rev4.jpg", // Replace with actual review screenshot
    customer: "Israa farooq",
    rating: 5,
    product: "Stickers",
    date: "2025-01-08",
    featured: false
  },
  {
    id: 5,
    image: "/reviews/rev5.jpg", // Replace with actual review screenshot
    customer: "Maliha.",
    rating: 5,
    product: "Bundle Cards",
    date: "2025-05-15",
    featured: true
  },
  {
    id: 6,
    image: "/reviews/rev6.jpg", // Replace with actual review screenshot
    customer: "Maham.",
    rating: 5,
    product: "RAW cards",
    date: "2025-05-15",
    featured: true
  },
]

export default function ReviewsPage() {
  const router = useRouter()
  const [selectedReview, setSelectedReview] = useState<typeof reviewScreenshots[0] | null>(null)

  const handleBackClick = () => {
    router.push('/')
  }

  const handleReviewClick = (review: typeof reviewScreenshots[0]) => {
    setSelectedReview(review)
  }

  const closeModal = () => {
    setSelectedReview(null)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <>
    
    <Navbar />
   
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 mt-18 sm:mt-24">
      {/* Header */}
   <header className="bg-white/80 backdrop-blur-md border-b border-rose-200/50 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Back Button - Left Side */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBackClick}
        className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </motion.button>
            
       {/* Centered Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <FiStar className="w-6 h-6 text-[#212121]" />
        <h1 className="text-xl font-semibold text-[#212121] whitespace-nowrap">
          <span className="hidden sm:inline">Customer Reviews</span>
          <span className="sm:hidden">Reviews</span>
        </h1>
      </div>
            
  <div className="w-[120px] sm:w-[140px]"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212121] mb-4 font-playfair">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real reviews from real customers who love our Pokemon Store. 
            See why thousands of people choose Pokemon Store.
          </p>
          
       
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {reviewScreenshots.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group cursor-pointer"
              onClick={() => handleReviewClick(review)}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-rose-100">
                {/* Review Image - Fixed responsive sizing */}
                <div className="relative w-full h-64 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
                  <Image
                    src={review.image}
                    alt={`Review from ${review.customer}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Featured Badge */}
                  {review.featured && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FiMessageCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Review Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{review.customer}</h3>
                  <p className="text-sm text-gray-600">{review.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-[#212121]  rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 font-playfair">Join Our Happy Customers</h3>
            <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
              Experience the difference that organic, handcrafted beauty products can make. 
              Start your journey to natural beauty today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#212121] px-8 py-3 rounded-full font-semibold hover:bg-rose-50 transition-colors"
              onClick={() => window.location.href = '/products'}
            >
              Shop Now
            </motion.button>
          </div>
             {/* Stats */}
             <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#202020]">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#202020]">2,500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#202020]">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Modal for enlarged review - Fixed sizing and responsiveness */}
      {selectedReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Review from {selectedReview.customer}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Responsive image container */}
              <div className="relative w-full mb-6 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={selectedReview.image}
                  alt={`Review from ${selectedReview.customer}`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[70vh]"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(selectedReview.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedReview.rating}/5 stars
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{selectedReview.date}</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-900">{selectedReview.customer}</h4>
                  <p className="text-gray-600 font-medium">{selectedReview.product}</p>
                </div>
                
                {selectedReview.featured && (
                  <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-2 rounded-full text-sm font-medium">
                    <FiHeart className="w-4 h-4" />
                    Featured Review
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
    <Footer />
    </>
  )
}