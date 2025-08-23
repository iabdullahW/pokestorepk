"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/firebase-auth"
import type { Product, CartItem } from "@/types"

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getCartTotal: () => number
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pokwmon-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pokemon-cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = async (product: Product) => {
    try {
      // Check if user is authenticated
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        // User is not authenticated, show auth modal
        setShowAuthModal(true)
        toast({
          title: "Authentication Required",
          description: "Please sign in or create an account to add items to your cart.",
          variant: "destructive",
        })
        return
      }

      // Check stock availability
      if ((product.stockQuantity || 0) < 1) {
        toast({
          title: "Out of Stock",
          description: "This product is currently out of stock.",
          variant: "destructive",
        })
        return
      }

      // User is authenticated and product is in stock, add to cart
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id)
        if (existingItem) {
          // Check if adding one more would exceed stock
          if (existingItem.quantity >= (product.stockQuantity || 0)) {
            toast({
              title: "Stock Limit Reached",
              description: `Cannot add more. Only ${product.stockQuantity} items available.`,
              variant: "destructive",
            })
            return prev
          }
          return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        }
        return [...prev, { ...product, quantity: 1 }]
      })

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error checking authentication:", error)
      // If there's an error checking auth, show auth modal
      setShowAuthModal(true)
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to add items to your cart.",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Apply discount only for booster categories
      if (item.category === "booster" && item.quantity >= 5) {
        return total + (item.price * item.quantity * 0.85) // 15% discount
      } else if (item.category === "booster" && item.quantity >= 3) {
        return total + (item.price * item.quantity * 0.90) // 10% discount
      }
      return total + item.price * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        getCartTotal,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
