"use client"

import type React from "react"
import { useEffect } from "react"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import { initializeFirebase } from "@/lib/firebase"
import CustomerAuth from "@/components/auth/CustomerAuth"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"

function AuthModalWrapper() {
  const { showAuthModal, setShowAuthModal } = useCart()
  const { user } = useAuth()

  const handleAuthSuccess = (userData: any) => {
    // The auth success is handled in the CustomerAuth component
    // This is just for the cart context
  }

  return (
    <CustomerAuth
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      onSuccess={handleAuthSuccess}
    />
  )
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Firebase when the app starts
    const initFirebase = async () => {
      try {
        console.log("🚀 Initializing Firebase...")
        const isReady = await initializeFirebase()
        if (isReady) {
          console.log("✅ Firebase initialized successfully")
        } else {
          console.error("❌ Firebase initialization failed")
        }
      } catch (error) {
        console.error("❌ Error during Firebase initialization:", error)
      }
    }

    initFirebase()
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <AuthModalWrapper />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  )
}
