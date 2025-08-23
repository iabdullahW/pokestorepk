"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiPackage, FiUsers, FiShoppingCart, FiLogOut, FiTag } from "react-icons/fi"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import ProductManagement from "./ProductManagement"
import OrderManagement from "./OrderManagement"
import UserManagement from "./UserManagement"
import CategoryManagement from "./CategoryManagement"
import { getProducts, getOrders, getUsers, getCategories } from "@/lib/firestore"

interface DashboardStats {
  products: number
  orders: number
  users: number
  categories: number
}

export default function AdminDashboard() {
  // Initialize active tab from localStorage or default to 'products'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin-active-tab') || 'products'
    }
    return 'products'
  })
  const [stats, setStats] = useState<DashboardStats>({ products: 0, orders: 0, users: 0, categories: 0 })
  const [loading, setLoading] = useState(true)
  const { logout, user } = useAuth()
  const { toast } = useToast()

  const tabs = [
    { id: "products", name: "Products", icon: FiPackage },
    { id: "categories", name: "Categories", icon: FiTag },
    { id: "orders", name: "Orders", icon: FiShoppingCart },
    { id: "users", name: "Users", icon: FiUsers },
  ]

  // Initialize stats and fetch data on mount
  useEffect(() => {
    if (!user || !user.isAdmin) return
    
    // Only fetch stats if we don't have any data yet
    const hasNoData = stats.products === 0 && 
                     stats.orders === 0 && 
                     stats.users === 0 && 
                     stats.categories === 0
                     
    if (hasNoData) {
      fetchDashboardStats()
    }
  }, [user])
  
  // Handle tab changes
  useEffect(() => {
    if (!user || !user.isAdmin) return
    fetchDashboardStats()
  }, [activeTab])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      if (!user || !user.isAdmin) {
        console.warn("🔒 Skipping fetch: user not admin or not authenticated yet")
        return
      }
      
      // Only fetch data for the current tab
      const statsToFetch: Partial<DashboardStats> = {}
      
      if (activeTab === 'products' || stats.products === 0) {
        statsToFetch.products = (await getProducts()).length
      }
      
      if (activeTab === 'orders' || stats.orders === 0) {
        statsToFetch.orders = (await getOrders()).length
      }
      
      if (activeTab === 'users' || stats.users === 0) {
        statsToFetch.users = (await getUsers()).length
      }
      
      if (activeTab === 'categories' || stats.categories === 0) {
        statsToFetch.categories = (await getCategories()).length
      }
      
      setStats(prev => ({
        ...prev,
        ...statsToFetch
      }))
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId)
      // Save active tab to localStorage
      localStorage.setItem('admin-active-tab', tabId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-16 gap-4 sm:gap-0">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Pokemon Store Admin</h1>
              <p className="text-xs sm:text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-8 sm:w-12 rounded"></div>
                  ) : (
                    stats.products
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Categories</p>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-8 sm:w-12 rounded"></div>
                  ) : (
                    stats.categories
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-8 sm:w-12 rounded"></div>
                  ) : (
                    stats.orders
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-8 sm:w-12 rounded"></div>
                  ) : (
                    stats.users
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Refresh Button */}
        <div className="mb-4 sm:mb-6 flex justify-end">
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </div>
            <span className="hidden sm:inline">{loading ? "Refreshing..." : "Refresh Stats"}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8 px-4 sm:px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-rose-500 text-rose-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "products" && <ProductManagement />}
            {activeTab === "categories" && <CategoryManagement />}
            {activeTab === "orders" && <OrderManagement />}
            {activeTab === "users" && <UserManagement />}
          </div>
        </div>
      </div>
    </div>
  )
}
