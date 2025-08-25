"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiX } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import { registerUser, loginUser } from "@/lib/firebase-auth"

interface CustomerAuthProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
}

export default function CustomerAuth({ isOpen, onClose, onSuccess }: CustomerAuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const result = await loginUser(formData.email, formData.password)
        if (result.success && result.user) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          })
          onSuccess(result.user)
          onClose()
        } else {
          toast({
            title: "Login Failed",
            description: result.error || "Invalid credentials",
            variant: "destructive",
          })
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Registration Failed",
            description: "Passwords do not match",
            variant: "destructive",
          })
          return
        }

        const result = await registerUser(formData.email, formData.password, formData.name)
        if (result.success && result.user) {
          toast({
            title: "Registration Successful",
            description: "Account created successfully!",
          })
          onSuccess(result.user)
          onClose()
        } else {
          toast({
            title: "Registration Failed",
            description: result.error || "Failed to create account",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl sm:rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <motion.button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base text-black"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base text-black"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base text-black"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base text-black"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-[#212121] to-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base">{isLogin ? "Signing In..." : "Creating Account..."}</span>
              </div>
            ) : (
              <span className="text-sm sm:text-base">{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ name: "", email: "", password: "", confirmPassword: "" })
              }}
              className="text-rose-500 hover:text-rose-600 font-medium text-xs sm:text-sm"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
} 