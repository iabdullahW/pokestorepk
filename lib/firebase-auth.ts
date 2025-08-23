import { getFirebaseServices, isFirebaseReady, initializeFirebase } from "./firebase"
import { addUser, getUserByFirebaseUid } from "./firestore"
import type { User } from "@/types"

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

// Initialize Firebase Auth
export const initializeAuth = async (): Promise<boolean> => {
  try {
    const isReady = await initializeFirebase()
    if (!isReady) {
      console.log("❌ Firebase not ready for auth")
      return false
    }
    return true
  } catch (error) {
    console.error("❌ Error initializing auth:", error)
    return false
  }
}

// Get current Firebase user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    // Ensure Firebase is initialized
    if (!isFirebaseReady()) {
      const isReady = await initializeFirebase()
      if (!isReady) {
        console.log("❌ Firebase not ready for auth")
        return null
      }
    }

    const services = getFirebaseServices()
    if (!services?.auth) {
      console.log("❌ Firebase Auth not available")
      return null
    }

    const { onAuthStateChanged } = await import("firebase/auth")
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(services.auth, (user) => {
        unsubscribe()
        if (user) {
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        } else {
          resolve(null)
        }
      })
    })
  } catch (error) {
    console.error("❌ Error getting current user:", error)
    return null
  }
}

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    // Ensure Firebase is initialized
    if (!isFirebaseReady()) {
      const isReady = await initializeFirebase()
      if (!isReady) {
        return { success: false, error: "Firebase not ready" }
      }
    }

    const services = getFirebaseServices()
    if (!services?.auth) {
      return { success: false, error: "Firebase Auth not available" }
    }

    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
    
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(services.auth, email, password)
    const firebaseUser = userCredential.user

    // Update display name
    if (firebaseUser) {
      await updateProfile(firebaseUser, {
        displayName: name,
      })
    }

    // Create user document in Firestore
    const userData: Omit<User, "id" | "createdAt"> = {
      email,
      name,
      firebaseUid: firebaseUser.uid,
    }

    const userId = await addUser(userData)
    if (!userId) {
      console.warn("⚠️ Failed to create user document in Firestore")
    }

    const authUser: AuthUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: name,
      photoURL: firebaseUser.photoURL,
    }

    console.log("✅ User registered successfully:", email)
    return { success: true, user: authUser }
  } catch (error: any) {
    console.error("❌ Registration error:", error)
    
    let errorMessage = "Registration failed"
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already registered"
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    }

    return { success: false, error: errorMessage }
  }
}

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    // Ensure Firebase is initialized
    if (!isFirebaseReady()) {
      const isReady = await initializeFirebase()
      if (!isReady) {
        return { success: false, error: "Firebase not ready" }
      }
    }

    const services = getFirebaseServices()
    if (!services?.auth) {
      return { success: false, error: "Firebase Auth not available" }
    }

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    
    const userCredential = await signInWithEmailAndPassword(services.auth, email, password)
    const firebaseUser = userCredential.user

    // Get user data from Firestore
    let userData = await getUserByFirebaseUid(firebaseUser.uid)
    // If user doc missing, create it now to align with rules
    if (!userData) {
      const inferredName = firebaseUser.displayName || (email?.split("@")[0] ?? "User")
      await addUser({
        email: firebaseUser.email || email,
        name: inferredName,
        firebaseUid: firebaseUser.uid,
      } as Omit<User, "id" | "createdAt">)
      userData = await getUserByFirebaseUid(firebaseUser.uid)
    }

    const authUser: AuthUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || userData?.name || null,
      photoURL: firebaseUser.photoURL,
    }

    console.log("✅ User logged in successfully:", email)
    return { success: true, user: authUser }
  } catch (error: any) {
    console.error("❌ Login error:", error)
    
    let errorMessage = "Login failed"
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found"
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    }

    return { success: false, error: errorMessage }
  }
}

// Logout user
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const services = getFirebaseServices()
    if (!services?.auth) {
      return { success: false, error: "Firebase Auth not available" }
    }

    const { signOut } = await import("firebase/auth")
    await signOut(services.auth)

    console.log("✅ User logged out successfully")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Logout error:", error)
    return { success: false, error: "Logout failed" }
  }
}

// Reset password
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const services = getFirebaseServices()
    if (!services?.auth) {
      return { success: false, error: "Firebase Auth not available" }
    }

    const { sendPasswordResetEmail } = await import("firebase/auth")
    await sendPasswordResetEmail(services.auth, email)

    console.log("✅ Password reset email sent to:", email)
    return { success: true }
  } catch (error: any) {
    console.error("❌ Password reset error:", error)
    
    let errorMessage = "Password reset failed"
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    }

    return { success: false, error: errorMessage }
  }
}

// Update user profile
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const services = getFirebaseServices()
    if (!services?.auth?.currentUser) {
      return { success: false, error: "No user logged in" }
    }

    const { updateProfile } = await import("firebase/auth")
    await updateProfile(services.auth.currentUser, {
      displayName,
      photoURL,
    })

    console.log("✅ User profile updated successfully")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Profile update error:", error)
    return { success: false, error: "Profile update failed" }
  }
} 