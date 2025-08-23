"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiPlus, FiEdit, FiTrash2, FiTag } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types"
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/firestore"

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)

      if (fetchedCategories.length === 0) {
        toast({
          title: "No Categories",
          description: "No categories found. Add your first category to get started.",
        })
      } else {
        toast({
          title: "Categories Loaded",
          description: `Successfully loaded ${fetchedCategories.length} categories from Firebase.`,
        })
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories from Firebase.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      setFormData(prev => ({
        ...prev,
        slug,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingCategory) {
        // Update existing category
        const success = await updateCategory(editingCategory.id, {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        })

        if (success) {
          const updatedCategories = categories.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, name: formData.name, slug: formData.slug, description: formData.description }
              : cat
          )
          setCategories(updatedCategories)

          toast({
            title: "Success",
            description: "Category updated successfully in Firebase.",
          })
        } else {
          throw new Error("Failed to update category")
        }
      } else {
        // Add new category
        const categoryId = await addCategory({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        })

        if (categoryId) {
          const newCategory: Category = {
            id: categoryId,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            createdAt: new Date(),
          }
          setCategories([newCategory, ...categories])

          toast({
            title: "Success",
            description: "Category added successfully to Firebase.",
          })
        } else {
          throw new Error("Failed to add category")
        }
      }

      // Reset form
      setFormData({ name: "", slug: "", description: "" })
      setShowAddForm(false)
      setEditingCategory(null)
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save category to Firebase.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    })
    setShowAddForm(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        const success = await deleteCategory(categoryId)
        if (success) {
          const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
          setCategories(updatedCategories)

          toast({
            title: "Success",
            description: "Category deleted successfully from Firebase.",
          })
        } else {
          throw new Error("Failed to delete category")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
        toast({
          title: "Error",
          description: "Failed to delete category from Firebase.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Category Management</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Firebase Connected - Manage product categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-rose-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Lip Balm"
                className="w-full px-3 py-2 border bg-black  border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="e.g., lip-balm"
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of this category..."
                className="w-full px-3 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="bg-rose-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingCategory(null)
                  setFormData({ name: "", slug: "", description: "" })
                }}
                className="bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No categories found. Add your first category to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                          <FiTag className="w-4 h-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Category"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Category"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 