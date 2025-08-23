"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield } from "react-icons/fi"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "Login successful! 🎉",
          description: "Welcome to the admin panel",
        })
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please check your email and password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during login",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full opacity-20" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-rose-300 to-pink-300 rounded-full opacity-20" />

        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-br from-[#212121] to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FiShield className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="font-playfair text-2xl sm:text-3xl font-bold gradient-text mb-2">Admin Portal</h1>
          <p className="text-sm sm:text-base text-gray-600">Pokemon Store Management</p>

          {/* Simple Auth Status */}
          <div className="flex items-center justify-center gap-2 mt-4 p-2 sm:p-3 rounded-lg bg-green-50 border border-green-200">
            <FiUser className="w-4 h-4 text-green-600" />
            <span className="text-xs sm:text-sm text-green-700"> Authentication</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm sm:text-base text-black"
                placeholder="Enter admin email"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm sm:text-base text-black"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-br from-[#212121] to-gray-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign In to Admin Panel"
            )}
          </motion.button>
        </form>

        {/* Credentials Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg relative z-10"
        >
          <p className="text-xs text-gray-600 text-center mb-3">
            <strong>Admin Credentials (Pre-filled):</strong>
          </p>
          <div className="text-xs text-gray-700 space-y-1 text-center">
            <div>📧 Email: pok******@gmail.com</div>
            <div>🔑 Password: po*********</div>
          </div>

          {/* <div className="border-t border-gray-200 pt-3 mt-3">
            <p className="text-xs font-medium text-gray-700 mb-2 text-center">✨ Features Available:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span>Product Management (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span>Order Management (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span>User Management (Demo)</span>
              </div>
            </div>
          </div> */}
        </motion.div>

        {/* No Firebase Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg relative z-10"
        >
          <p className="text-xs text-blue-700 text-center">
            🚀 <strong>Welcome</strong> Admin!
            <br />
          Pokemon Store.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
