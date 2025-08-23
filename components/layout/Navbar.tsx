"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiSearch, FiShoppingBag, FiX, FiChevronDown, FiChevronUp, FiUser, FiLogOut, FiShoppingCart } from "react-icons/fi"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import SearchModal from "@/components/modals/SearchModal"
import CustomerAuth from "@/components/auth/CustomerAuth"
import Sidebar from "@/components/layout/Sidebar"
import { getCurrentUser, logoutUser } from "@/lib/firebase-auth"
import { getCategories } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types"
import Image from "next/image"
import PokemonLogo from "@/public/pokemonlogo.png" // Adjust the path as necessary

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleCart, cartItems } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    checkAuthStatus()
    fetchCategories()
  }, [])

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.account-dropdown')) {
        setIsAccountDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
    setShowAuth(false)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setUser(null)
      setIsAccountDropdownOpen(false)
      toast({
        title: "Success",
        description: "Logged out successfully.",
      })
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      })
    }
  }

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute  w-full z-50 navbar-transparent"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 ">
          <div className="grid grid-cols-3  items-center h-14 sm:h-16 ">
            {/* Left - Hamburger Menu */}
            <div className="flex justify-start">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[#212121] transition-all duration-300 hover:scale-105"
              >
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffffff]" />
              </motion.button>
            </div>

            {/* Center - Company Name */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center cursor-pointer"
                onClick={() => router.push("/")}
              >

                <Image
                  src={PokemonLogo}
                  alt="Pokemon Logo"
                  width={50}
                  height={50}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover "
                />
              </motion.div>
            </div>

            {/* Right - Search, Cart, Account */}
            <div className="flex justify-end items-center space-x-1 sm:space-x-1.5 md:space-x-2">
              {/* Search */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-[#212121] transition-all duration-300 hover:scale-105"
                >
                  <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                </motion.button>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white hover:bg-gray-100 text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                  Search (Ctrl+K)
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[#212121] transition-all duration-300 hover:scale-105 relative"
              >
                <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFFFF]" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[white] text-[#212121] text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Account */}
              {user ? (
                <div className="relative account-dropdown">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={toggleAccountDropdown}
                    className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-lg hover:bg-[#212121] transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#ffffff] rounded-full flex items-center justify-center text-[#212121] font-semibold text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    {isAccountDropdownOpen ? (
                      <FiChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffffff]" />
                    ) : (
                      <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffffff]" />
                    )}
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isAccountDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-36 sm:w-40 md:w-48 bg-[#D1D1D1] rounded-md shadow-lg border border-rose-100 z-50"
                      >
                        <div className="py-2">
                          <div className="px-3 sm:px-4 py-2 border-b border-rose-100">
                            <div className="font-medium text-[#212121] truncate text-xs sm:text-sm">{user.displayName || "User"}</div>
                            <div className="text-xs text-[#212121] truncate">{user.email}</div>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-3 sm:px-4 py-2 text-[#212121] hover:bg-gray-100 transition-colors text-xs sm:text-sm"
                          >
                            <FiLogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuth(true)}
                  className="bg-[#212121] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        user={user}
      />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Auth Modal */}
      <CustomerAuth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}