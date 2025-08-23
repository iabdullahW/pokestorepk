"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiEye, FiCheck, FiX, FiTrash2, FiPackage, FiUser, FiMapPin, FiCreditCard, FiTruck } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/types"
import { getOrders, updateOrderStatus, deleteOrder } from "@/lib/firestore"

export default function OrderManagement() {
  const { toast } = useToast()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const fetchedOrders = await getOrders()
      setOrders(fetchedOrders)

      if (fetchedOrders.length === 0) {
        toast({
          title: "No Orders",
          description: "No orders found. Orders will appear here when customers place them.",
        })
      } else {
        toast({
          title: "Orders Loaded",
          description: `Successfully loaded ${fetchedOrders.length} orders from Firebase.`,
        })
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders from Firebase.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const success = await updateOrderStatus(orderId, status)
      if (success) {
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order)))

        toast({
          title: "Success",
          description: `Order status updated to ${status} in Firebase.`,
        })
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status in Firebase.",
        variant: "destructive",
      })
    }

    setSelectedOrder(null)
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const success = await deleteOrder(orderId)
        if (success) {
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))

          toast({
            title: "Success",
            description: "Order deleted successfully from Firebase.",
          })
        } else {
          throw new Error("Failed to delete order")
        }
      } catch (error) {
        console.error("Error deleting order:", error)
        toast({
          title: "Error",
          description: "Failed to delete order from Firebase.",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderSummary = (order: Order) => {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
    const itemNames = order.items.map(item => `${item.name} (${item.quantity})`).join(", ")
    return { totalItems, itemNames }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-600 mt-1">Firebase Connected - Real orders from customers</p>
        </div>
        <div className="text-sm text-gray-600">Total Orders: {orders.length}</div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No orders found. Orders will appear here when customers place them.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const { totalItems, itemNames } = getOrderSummary(order)
                  return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                      <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                        <div className="text-xs text-gray-400">{order.customerInfo.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1 mb-1">
                            <FiPackage className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">{totalItems} items</span>
                          </div>
                          <div className="text-xs text-gray-500 max-w-xs truncate" title={itemNames}>
                            {itemNames}
                          </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs{order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {order.paymentMethod === 'cod' ? (
                          <>
                            <FiTruck className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">COD</span>
                          </>
                        ) : (
                          <>
                            <FiCreditCard className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Confirm Order"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Mark as Completed"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Cancel Order"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Order"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Details - #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">Placed on {selectedOrder.createdAt.toLocaleDateString()} at {selectedOrder.createdAt.toLocaleTimeString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="bg-gray-300 text-black rounded-lg p-4 space-y-2">
                    <p>
                      <strong>Name:</strong> {selectedOrder.customerInfo.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.customerInfo.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.customerInfo.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}{" "}
                      - {selectedOrder.customerInfo.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    Order Summary
                  </h4>
                  <div className="bg-blue-400 text-black rounded-lg p-4 space-y-2">
                    <p>
                      <strong>Total Items:</strong> {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> Rs{selectedOrder.total}
                    </p>
                    <p className="flex items-center gap-2">
                      <strong>Payment Method:</strong>
                      {selectedOrder.paymentMethod === 'cod' ? (
                        <span className="flex items-center gap-1 text-orange-600">
                          <FiTruck className="w-4 h-4" />
                          Cash on Delivery (+Rs200)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600">
                          <FiCreditCard className="w-4 h-4" />
                          Online Payment
                        </span>
                      )}
                    </p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiPackage className="w-4 h-4" />
                  Order Items ({selectedOrder.items.length} products)
                </h4>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-black divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className="font-medium">{item.quantity}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">Rs{item.price}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Rs{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-medium bg-gray-300 text-black">Total:</td>
                        <td className="px-4 py-3 font-bold text-lg text-gray-900">Rs{selectedOrder.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                  </div>
                </div>

                {/* Status Update */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Update Order Status</h4>
                <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "confirmed")}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                    Confirm Order
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                    Mark as Completed
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "cancelled")}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                    Cancel Order
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
