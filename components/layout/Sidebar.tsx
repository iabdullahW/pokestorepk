"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiHome, FiPackage, FiShoppingBag, FiUser, FiTruck, FiX, FiChevronRight, FiChevronDown, FiChevronUp, FiInfo, FiMessageSquare, FiHelpCircle } from "react-icons/fi"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getOrdersByUserId } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import type { Order, Category } from "@/types"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  user: any
}

export default function Sidebar({ isOpen, onClose, categories, user }: SidebarProps) {
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && user) {
      fetchUserOrders()
    }
  }, [isOpen, user])

  const fetchUserOrders = async () => {
    if (!user?.uid) return

    setLoadingOrders(true)
    try {
      const orders = await getOrdersByUserId(user.uid)
      setUserOrders(orders)
    } catch (error) {
      console.error("Error fetching user orders:", error)
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      })
    } finally {
      setLoadingOrders(false)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "confirmed":
        return "text-blue-600 bg-blue-100"
      case "completed":
        return "text-green-600 bg-green-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "⏳"
      case "confirmed":
        return "✅"
      case "completed":
        return "📦"
      case "cancelled":
        return "❌"
      default:
        return "📋"
    }
  }

  const handleNavigation: (path: string) => void = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path)
      element?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(path)
    }
    onClose()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-xs sm:max-w-sm md:w-80 bg-[#212121] text-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b bg-[#252525]  flex-shrink-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-[#ffffff]">
                  Menu
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-lg text-white hover:bg-[#252525] transition-colors"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                </motion.button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <nav className="space-y-1 sm:space-y-2">
                {/* Home */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation("/")}
                  className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-lg hover:bg-gray-500 transition-colors text-left"
                >
                  <FiHome className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                  <span className="font-medium text-[#fffff] text-sm sm:text-base">Home</span>
                </motion.button>

                {/* Categories Dropdown */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center justify-between w-full p-2.5 sm:p-3 rounded-lg hover:bg-gray-500 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                      <span className="font-medium text-[#ffffff] text-sm sm:text-base">Categories</span>
                    </div>
                    {isCategoriesOpen ? <FiChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>

                  <AnimatePresence>
  {isCategoriesOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden ml-6 sm:ml-8 mt-1 sm:mt-2 space-y-1"
    >
      {[...categories] // copy the array to avoid mutating state
        .sort((a, b) => a.name.localeCompare(b.name)) // ✅ alphabetical sort
        .map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleNavigation(`/products/${category.slug}`)}
            className="block w-full text-left py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-500 transition-colors text-[#ffffff] text-xs sm:text-sm"
          >
            {category.name}
          </motion.button>
        ))}
    </motion.div>
  )}
</AnimatePresence>
                </motion.div>

                {/* Our Products */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation("/products")}
                  className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-lg hover:bg-gray-500 transition-colors text-left"
                >
                  <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                  <span className="font-medium text-[#ffffff] text-sm sm:text-base">Our Products</span>
                </motion.button>

                {/* About Us */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation("#about")}
                  className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-lg hover:bg-gray-500 transition-colors text-left"
                >
                  <FiInfo className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                  <span className="font-medium text-[#ffffff] text-sm sm:text-base">About Us</span>
                </motion.button>

                {/* Reviews */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation("#reviews")}
                  className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-lg hover:bg-gray-500 transition-colors text-left"
                >
                  <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                  <span className="font-medium text-[#ffffff] text-sm sm:text-base">Reviews</span>
                </motion.button>

                {/* FAQs */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation("#faqs")}
                  className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-lg hover:bg-gray-500 transition-colors text-left"
                >
                  <FiHelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                  <span className="font-medium text-[#ffffff] text-sm sm:text-base">FAQs</span>
                </motion.button>

                {/* Track Order */}
                {user && (
                  <div className="mt-4 sm:mt-6">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-[white]" />
                      <h3 className="font-semibold text-[white] text-sm sm:text-base">Track My Orders</h3>
                    </div>

                    {loadingOrders ? (
                      <div className="flex items-center justify-center py-3 sm:py-4 bg-gray-700">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-rose-500"></div>
                        <span className="ml-2 sm:ml-3 text-gray-600 text-xs sm:text-sm">Loading orders...</span>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="text-center py-3 sm:py-4 bg-gray-700">
                        <FiTruck className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mx-auto mb-1 sm:mb-2" />
                        <p className="text-gray-400 text-xs sm:text-sm">No orders found</p>
                        <p className="text-gray-300 text-xs mt-1">Your orders will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-1 sm:space-y-2">
                        {userOrders.map((order) => (
                          <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 sm:p-3 bg-white rounded-lg cursor-pointer hover:bg-rose-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-[black]">
                                Order #{order.id.slice(-8)}
                              </span>
                              <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)} {order.status}
                              </span>
                            </div>
                            
                            <div className="text-xs text-gray-600">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Rs{order.total}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </div>

            {/* Account Info Footer */}
            {user && (
              <div className="p-4 sm:p-6 border-t border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#212121] rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-[black] text-sm sm:text-base">
                      {user.displayName || "Welcome back!"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Order Details Modal */}
          <AnimatePresence>
            {selectedOrder && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedOrder(null)}
                  className="fixed inset-0 bg-black/50 z-60"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl z-60 overflow-hidden flex flex-col shadow-2xl max-w-full max-h-full"
                >
                  {/* Modal Header */}
                  <div className="p-4 sm:p-6 border-b border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-[#ffffff]">
                        Order Details
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOrder(null)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-rose-200 transition-colors"
                      >
                        <FiX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#ffffff]" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-2xl mx-auto">
                      {/* Order Info */}
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-rose-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#ffffff] text-sm sm:text-base">
                            Order #{selectedOrder.id.slice(-8)}
                          </h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Placed on {formatDate(selectedOrder.createdAt)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Total: Rs{selectedOrder.total}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="font-semibold text-[#ffffff] mb-2 sm:mb-3 text-sm sm:text-base">Delivery Details</h4>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs sm:text-sm font-medium">{selectedOrder.customerInfo.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{selectedOrder.customerInfo.email}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{selectedOrder.customerInfo.phone}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                            {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city} - {selectedOrder.customerInfo.pincode}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-[#ffffff] mb-2 sm:mb-3 text-sm sm:text-base">Order Items</h4>
                        <div className="space-y-2 sm:space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-[#ffffff] text-xs sm:text-sm">{item.name}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-xs sm:text-sm">Rs{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
} 