"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiUser, FiCreditCard, FiTruck } from "react-icons/fi"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import CheckoutForm from "./CheckoutForm"

export default function Cart() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-sm md:max-w-md bg-white/95 backdrop-blur-xl z-50 shadow-dusty-rose-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-rose-200/50 bg-[#212121] text-white backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 " />
                  <h2 className="font-playfair text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white"></h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleCart}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.button>
              </div>
              <p className="text-xs sm:text-sm text-white mt-1 sm:mt-2">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <FiShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-black mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base md:text-lg"> is empty</p>
                  {!user ? (
                    <div className="mt-3 sm:mt-4">
                      <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">Sign in to add products to your cart</p>
                      <div className="flex items-center justify-center gap-1 sm:gap-2 text-rose-500">
                        <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">Authentication Required</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">Add some products to get started!</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-gray-300 text-black backdrop-blur-sm border border-rose-200/30 rounded-xl hover:bg-rose-100/60 transition-all duration-300"
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-black mb-1 text-xs sm:text-sm md:text-base truncate">{item.name}</h3>
                        <div className="text-xs sm:text-sm text-gray-800">
                          {item.category === "booster" && item.quantity >= 3 ? (
                            <div>
                              <span className="line-through text-gray-500">Rs{item.price * item.quantity}</span>
                              <span className="ml-2 font-medium text-green-600">
                                Rs{item.quantity >= 5 ? (item.price * item.quantity * 0.85).toFixed(2) : (item.price * item.quantity * 0.90).toFixed(2)}
                              </span>
                              <div className="text-xs text-green-600">
                                {item.quantity >= 5 ? "15% off" : "10% off"}
                              </div>
                            </div>
                          ) : (
                            <span>Rs{(item.price * item.quantity).toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-rose-200 transition-colors"
                        >
                          <FiMinus className="w-3 h-3 sm:w-4 sm:h-4 text-[black]" />
                        </motion.button>

                        <span className="w-5 h-5 sm:w-6 sm:w-7 md:w-8 text-center font-medium text-[black] text-xs sm:text-sm flex items-center justify-center">{item.quantity}</span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-rose-200 transition-colors"
                        >
                          <FiPlus className="w-3 h-3 sm:w-4 sm:h-4 text-[black]" />
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-rose-200 transition-colors flex-shrink-0"
                      >
                        <FiX className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-3 sm:p-4 md:p-6 border-t border-rose-200 bg-[#212121] text-white flex-shrink-0">
                {/* Payment Method Selection */}
                <div className="mb-4">
                  <h3 className="text-sm sm:text-base font-medium text-white mb-3">Payment Method:</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                        className="w-4 h-4 text-white bg-gray-100 border-gray-300 focus:ring-white focus:ring-2"
                      />
                      <FiTruck className="w-4 h-4 text-white" />
                      <span className="text-sm text-white">Cash on Delivery (+Rs200)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                        className="w-4 h-4 text-white bg-gray-100 border-gray-300 focus:ring-white focus:ring-2"
                      />
                      <FiCreditCard className="w-4 h-4 text-white" />
                      <span className="text-sm text-white">Online Payment</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
                  <span className="text-sm sm:text-base md:text-lg font-medium text-[white]">Total:</span>
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold gradient-text">
                    Rs{paymentMethod === 'cod' ? getCartTotal() + 200 : getCartTotal()}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-white text-black hover:bg-gray-300 py-2.5 sm:py-3 md:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg l transition-all duration-300"
                >
                  Proceed to Checkout
                </motion.button>

                {paymentMethod === 'cod' ? (
                  <p className="text-xs text-center text-gray-500 mt-2 sm:mt-3">
                    Cash on Delivery: Rs200 extra
                  </p>
                ) : (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg max-h-48 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <FiCreditCard className="w-4 h-4" />
                      Bank Transfer Details
                    </h4>
                    <div className="text-xs text-blue-800 space-y-2">
                      <p className="font-medium">Please transfer the total amount to any one of the following accounts:</p>
                      
                      <div className="bg-white p-2 rounded border">
                        <p className="font-semibold">Bank 1 – Soneri Bank</p>
                        <p>Account Number: 20012600578</p>
                        <p>Account Holder: Ibtisam Yasin</p>
                      </div>
                      
                      <div className="bg-white p-2 rounded border">
                        <p className="font-semibold">Bank 2 – SadaPay</p>
                        <p>Account Number: 5590 4902 4907 5613</p>
                        <p>Account Holder: Ibtisam Yasin</p>
                      </div>
                      
                      <div className="flex items-start gap-2 mt-2">
                        <span className="text-blue-600">💎</span>
                        <div>
                          <p className="font-medium">WhatsApp Confirmation:</p>
                          <p>After making the payment, send a screenshot and your order number to:</p>
                          <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1">📱 +92 345 5102674</p>
                        </div>
                      </div>
                      
                      <p className="text-center font-medium text-blue-900 mt-2">
                        Your order will be processed once payment is verified. Thank you!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Checkout Form Modal */}
          <CheckoutForm 
            isOpen={showCheckout} 
            onClose={() => setShowCheckout(false)} 
            paymentMethod={paymentMethod}
          />
        </>
      )}
    </AnimatePresence>
  )
}
