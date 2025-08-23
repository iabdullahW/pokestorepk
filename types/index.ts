export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  stockQuantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  customerInfo: CustomerInfo
  status: "pending" | "confirmed" | "completed" | "cancelled"
  paymentMethod: "cod" | "online"
  createdAt: Date
}

export interface CartItem extends Product {
  quantity: number
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
}

export interface User {
  id: string
  email: string
  name: string
  firebaseUid?: string
  createdAt: Date
}
