"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"
import { addOrder, batchReduceStock } from "@/lib/firestore"
import { getCurrentUser } from "@/lib/firebase-auth"
import { sendOrderConfirmationEmail } from "@/lib/email"
import type { Order, CustomerInfo } from "@/types"

interface CheckoutFormProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: 'cod' | 'online'
}

export default function CheckoutForm({ isOpen, onClose, paymentMethod }: CheckoutFormProps) {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  })

  useEffect(() => {
    if (isOpen) {
      checkUserAuth()
    }
  }, [isOpen])

  const checkUserAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      // Pre-fill form with user data if available
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          email: currentUser.email || "",
          name: currentUser.displayName || "",
        }))
      }
    } catch (error) {
      console.error("Error checking user auth:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to proceed with checkout.",
          variant: "destructive",
        })
        return
      }

      // Validate cart has items
      if (cartItems.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Please add items to your cart before placing an order.",
          variant: "destructive",
        })
        return
      }

      // Create customer info
      const customerInfo: CustomerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      }

      // Create order data
      const orderData: Omit<Order, "id" | "createdAt"> = {
        userId: user.uid,
        customerInfo,
        items: cartItems,
        total: paymentMethod === 'cod' ? getCartTotal() + 200 : getCartTotal(),
        status: "pending",
        paymentMethod: paymentMethod,
      }

      // Save order to Firebase
      const orderId = await addOrder(orderData)

      if (orderId) {
        console.log("📦 Order placed successfully:", orderId)
        
        // Reduce stock quantities for all items in the order
        const stockReduced = await batchReduceStock(cartItems)
        if (!stockReduced) {
          console.warn("⚠️ Order placed but stock reduction failed")
          // Note: Order is still valid, stock will need manual adjustment
        }

        // Create complete order object for email
        const completeOrder: Order = {
          id: orderId,
          ...orderData,
          createdAt: new Date(),
        }

        // Send order confirmation email
        try {
          const emailSent = await sendOrderConfirmationEmail(customerInfo, completeOrder)
          
          if (emailSent) {
            toast({
              title: "Order placed successfully! 🎉",
              description: "Your order has been saved and confirmation email sent. You will receive a confirmation call within 24 hours.",
            })
          } else {
            toast({
              title: "Order placed successfully! 🎉",
              description: "Your order has been saved to our database. You will receive a confirmation call within 24 hours.",
            })
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError)
          // Order was still successful, just email failed
          toast({
            title: "Order placed successfully! 🎉",
            description: "Your order has been saved to our database. You will receive a confirmation call within 24 hours.",
          })
        }

        clearCart()
        onClose()
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          pincode: "",
        })
      } else {
        throw new Error("Failed to save order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "Please try again later. If the problem persists, contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalWithCOD = paymentMethod === 'cod' ? getCartTotal() + 200 : getCartTotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl z-[70] overflow-hidden flex flex-col shadow-2xl max-w-full max-h-full"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-rose-200 bg-[#212121] flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-[white]">Checkout</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[white]" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-full">
                {/* Customer Information */}
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[black] mb-3 sm:mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        required
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div className="relative sm:col-span-2">
                      <FiPhone className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        required
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[black] mb-3 sm:mb-4">Delivery Address</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Full Address"
                        required
                        rows={3}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none text-sm sm:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border text-black  border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[black] mb-3 sm:mb-4">Order Summary</h3>
                  <div className="bg-gray-300 rounded-lg p-3 sm:p-4 space-y-2">
                    <div className="flex justify-between text-sm sm:text-base text-gray-800">
                      <span>Subtotal:</span>
                      <span>Rs{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-black">
                      <span>Payment Method:</span>
                      <span>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between text-sm sm:text-base text-black">
                        <span>COD Charge:</span>
                        <span>Rs200</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base sm:text-lg md:text-xl text-black">
                      <span>Total:</span>
                      <span>Rs{totalWithCOD}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full bg-[#212121] hover:bg-gray-800 text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm sm:text-base ">Placing Order...</span>
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base md:text-lg">Place Order - Rs{totalWithCOD}</span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
