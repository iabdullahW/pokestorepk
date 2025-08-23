"use client"
import Seo from "@/components/Seo";
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import Navbar from "@/components/layout/Navbar"
import TopBar from "@/components/layout/TopBar"
import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import ReviewsSection from "@/components/sections/ReviewsSection"
import FAQSection from "@/components/sections/FAQSection"
import Footer from "@/components/layout/Footer"
import Cart from "@/components/cart/Cart"
import SearchModal from "@/components/modals/SearchModal"
import Sidebar from "@/components/layout/Sidebar"
import LoadingScreen from "@/components/ui/loading-screen"
import MidBar from "@/components/layout/MidBar";
import HeroCarousel from "@/components/layout/HeroCarousel";
import WhiteReview from "@/components/sections/WhiteReview";
import AboutnContact from "@/components/sections/AboutnContact";
import CategorySection from "@/components/sections/CategorySection";
export default function Home() {
  // Changed from isLoading to complete state pattern
  const [complete, setComplete] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  return (
    <>
      <Seo />
      <div className="no-overflow-x bg-gradient-to-br from-rose-50 via-white to-rose-50 min-h-screen">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-clean-white-pattern opacity-10 pointer-events-none" />
        
        {/* Loading Screen - Only render if not complete */}
        {!complete ? (
          <LoadingScreen setComplete={setComplete} />
        ) : (
          /* Main Content - Only render after loading is complete */
          <main className="relative min-h-screen no-overflow-x opacity-100">
            <TopBar />
            <MidBar />
            <Navbar />
            <HeroSection onSearchClick={handleSearchClick} />
            <HeroCarousel />
            <CategorySection />
            <AboutSection />
            <FAQSection />
            <AboutnContact />
            <ReviewsSection />
            <WhiteReview />
            <Footer />
            <Cart />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} categories={[]} user={undefined} />
          </main>
        )}
      </div>
    </>
  )
}