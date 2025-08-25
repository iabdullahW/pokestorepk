"use client"

import { motion } from "framer-motion"
import { FiArrowRight, FiSearch, FiStar } from "react-icons/fi"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

interface HeroSectionProps {
  onSearchClick?: () => void
}

export default function HeroSection({ onSearchClick }: HeroSectionProps) {
  const router = useRouter()

  const handleReviewsClick = () => {
    router.push('/reviews')
  }



  return (
    <section id="home" className="relative h-[70vh] sm:h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Fallback background for when video is not available */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-rose-50 to-white">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-dusty-rose-pattern opacity-30" />
        </div>

        {/* Video Element */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/placeholder.jpg"
        >
          {/* Video sources */}
          <source src="/herovideo.mp4" type="video/mp4" />
          {/* Fallback text for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

       
      </div>

      {/* Floating Orbs (reduced opacity for video background) */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-rose-300/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-rose-300/15 to-rose-400/15 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-rose-100/25 to-rose-200/25 rounded-full blur-lg"
      />
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4 sm:mb-6 md:mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                {/* Logo or decorative element */}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 md:pt-8"
            >
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Enhanced Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
        className="absolute top-10 left-10 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-200/30 to-rose-300/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-10 right-10 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-300/25 to-rose-400/25 rounded-full blur-sm"
      />

      {/* Reviews Button Overlay (for mobile) */}
      <div className="absolute bottom-4 right-4 z-20  ">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReviewsClick}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"
        >
          <img
            src="/favicon.png"
            alt="Star"
            className="w-11 h-11"
          />
        </motion.button>
      </div>
    </section>
  )
}