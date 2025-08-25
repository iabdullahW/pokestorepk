"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import Image from "next/image"
import { Montserrat } from "next/font/google"

// Load Montserrat font
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] })

export default function TopBar() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const company_Name = [
    { name: "PokeStore" },
    { name: "PokeStore" },
    { name: "PokeStore" },
    { name: "PokeStore" },
    { name: "PokeStore" },
    { name: "PokeStore" },
    { name: "PokeStore" },
    { name: "PokeStore" },
  ]

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

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const scrollWidth = carousel.scrollWidth

    const animation = gsap.to(carousel, {
      x: -scrollWidth / 2,
      duration: 90, // slow speed
      ease: "none",
      repeat: -1,
    })

    const handleMouseEnter = () => animation.pause()
    const handleMouseLeave = () => animation.resume()

    carousel.addEventListener("mouseenter", handleMouseEnter)
    carousel.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      animation.kill()
      carousel.removeEventListener("mouseenter", handleMouseEnter)
      carousel.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`${montserrat.className} bg-white text-black py-2.5 sm:py-2.5 px-3 sm:px-4 text-center text-[16px] sm:text-[18px] font-medium relative overflow-hidden`} // Increased padding & font size
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-soft"></div>
          <div
            ref={carouselRef}
            className="flex whitespace-nowrap relative z-10"
            style={{ width: "max-content" }}
          >
            {company_Name.concat(company_Name).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-6 text-[#000000]" // bigger gap
              >
                <Image
                  src="https://flagcdn.com/w20/pk.png"
                  alt="Pakistan Flag"
                  width={20} // bigger flag
                  height={14}
                />
                <span>
                  <strong className="font-bold">Poke</strong>
                  <span className="font-normal ml-2">Store</span> {/* more gap */}
                </span>
                <Image
                  src="https://flagcdn.com/w20/pk.png"
                  alt="Pakistan Flag"
                  width={20} // bigger flag
                  height={14}
                />
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
