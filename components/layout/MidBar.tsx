"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function MidBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#212121] text-white py-1.5 sm:py-2 px-3 sm:px-4 text-center text-xs sm:text-sm font-medium relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#212121] to-transparent animate-pulse-soft font-semibold"></div>
          <span className="relative z-10">  WELCOME TO OUR STORE  </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
