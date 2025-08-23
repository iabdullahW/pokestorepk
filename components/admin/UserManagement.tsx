"use client"

import { useState, useEffect } from "react"
import { FiTrash2, FiMail, FiPhone } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/types"
import { getUsers, deleteUser } from "@/lib/firestore"
import { useAuth } from "@/contexts/AuthContext"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !user.isAdmin) return
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      if (!user || !user.isAdmin) {
        console.warn("🔒 Skipping users fetch: not admin or not authenticated")
        return
      }
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)

      if (fetchedUsers.length === 0) {
        toast({
          title: "No Users",
          description: "No users found. Users will appear here when they register.",
        })
      } else {
        toast({
          title: "Users Loaded",
          description: `Successfully loaded ${fetchedUsers.length} users from Firebase.`,
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users from Firebase.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const success = await deleteUser(userId)
        if (success) {
          setUsers((prev) => prev.filter((user) => user.id !== userId))

          toast({
            title: "Success",
            description: "User deleted successfully from Firebase.",
          })
        } else {
          throw new Error("Failed to delete user")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: "Failed to delete user from Firebase.",
          variant: "destructive",
        })
      }
    }
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="p-6 text-sm text-gray-600">You must be an admin to view users.</div>
    )
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
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Firebase Connected - Real user data</p>
        </div>
        <div className="text-sm text-gray-600">Total Users: {users.length}</div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firebase UID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found. Users will appear here when they register.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">
                        {user.firebaseUid ? user.firebaseUid.substring(0, 8) + "..." : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete User"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Total Users</div>
          <div className="text-2xl font-semibold text-gray-900 mt-2">{users.length}</div>
          <div className="text-sm text-blue-600 mt-1">Registered users</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">New Users This Month</div>
          <div className="text-2xl font-semibold text-gray-900 mt-2">
            {users.filter(user => {
              const userDate = new Date(user.createdAt)
              const now = new Date()
              return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
            }).length}
          </div>
          <div className="text-sm text-green-600 mt-1">This month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Active Users</div>
          <div className="text-2xl font-semibold text-gray-900 mt-2">
            {users.filter(user => {
              const userDate = new Date(user.createdAt)
              const now = new Date()
              const diffTime = Math.abs(now.getTime() - userDate.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return diffDays <= 30
            }).length}
          </div>
          <div className="text-sm text-purple-600 mt-1">Last 30 days</div>
        </div>
      </div>
    </div>
  )
}
