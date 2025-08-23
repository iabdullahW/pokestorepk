import { getFirebaseServices, isFirebaseReady, initializeFirebase } from "./firebase"
import type { Order, User, Product, CartItem, CustomerInfo, Category } from "@/types"

// Helper function to get Firestore instance
const getDb = async () => {
  if (!isFirebaseReady()) {
    console.log("📦 Firestore not ready - attempting to initialize Firebase...")
    
    // Try to initialize Firebase if not ready
    const isReady = await initializeFirebase()
    if (!isReady) {
      console.log("❌ Firebase initialization failed - Firestore not available")
      return null
    }
  }

  try {
    const services = getFirebaseServices()
    if (!services?.db) {
      console.error("❌ Firestore service not available after initialization")
      return null
    }
    return services.db
  } catch (error) {
    console.error("❌ Error getting Firestore:", error)
    return null
  }
}

// ===== PRODUCT MANAGEMENT =====
export const addProduct = async (product: Omit<Product, "id">): Promise<string | null> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Product would be stored when Firebase is connected")
      return `offline-product-${Date.now()}`
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Added product: ${product.name}`)
    return docRef.id
  } catch (error) {
    console.error("❌ Error adding product:", error)
    return null
  }
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as unknown as Product[]

    console.log(`✅ Fetched ${products.length} products`)
    return products
  } catch (error) {
    console.error("❌ Error fetching products:", error)
    return []
  }
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Product would be updated when Firebase is connected")
      return true
    }

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = doc(db, "products", id)
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Updated product: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Error updating product ${id}:`, error)
    return false
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Product would be deleted when Firebase is connected")
      return true
    }

    const { doc, deleteDoc } = await import("firebase/firestore")
    await deleteDoc(doc(db, "products", id))

    console.log(`✅ Deleted product: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Error deleting product ${id}:`, error)
    return false
  }
}

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as unknown as Product[]

    console.log(`✅ Fetched ${products.length} products for category: ${category}`)
    return products
  } catch (error) {
    console.error("❌ Error fetching products by category:", error)
    return []
  }
}

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const db = await getDb()
    if (!db) return null

    const { doc, getDoc } = await import("firebase/firestore")
    const docRef = doc(db, "products", productId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const product = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as unknown as Product

      console.log(`✅ Fetched product: ${product.name}`)
      return product
    } else {
      console.log(`❌ Product not found: ${productId}`)
      return null
    }
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error)
    return null
  }
}

// ===== USER MANAGEMENT =====
export const addUser = async (user: Omit<User, "id" | "createdAt">): Promise<string | null> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 User would be stored when Firebase is connected")
      return `offline-user-${Date.now()}`
    }

    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")
    // Enforce document ID = Firebase UID to satisfy rules: users/{userId} where userId == request.auth.uid
    const uid = (user as any).firebaseUid
    if (!uid) {
      throw new Error("Missing firebaseUid for user document creation")
    }
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
    })

    console.log(`✅ Added user: ${user.email} (uid: ${uid})`)
    return uid
  } catch (error) {
    console.error("❌ Error adding user:", error)
    return null
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as User[]

    console.log(`✅ Fetched ${users.length} users`)
    return users
  } catch (error) {
    console.error("❌ Error fetching users:", error)
    return []
  }
}

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 User would be deleted when Firebase is connected")
      return true
    }

    const { doc, deleteDoc } = await import("firebase/firestore")
    await deleteDoc(doc(db, "users", id))

    console.log(`✅ Deleted user: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Error deleting user ${id}:`, error)
    return false
  }
}

// Get user by Firebase UID
export const getUserByFirebaseUid = async (firebaseUid: string): Promise<User | null> => {
  try {
    const db = await getDb()
    if (!db) return null

    // Read the user document directly by its UID (doc ID). This matches rules
    const { doc, getDoc } = await import("firebase/firestore")
    const userRef = doc(db, "users", firebaseUid)
    const snap = await getDoc(userRef)
    if (!snap.exists()) return null

    const data = snap.data()
    return {
      id: snap.id,
      ...data,
      createdAt: (data as any).createdAt?.toDate?.() || new Date(),
    } as User
  } catch (error) {
    console.error("❌ Error fetching user by Firebase UID:", error)
    return null
  }
}

// ===== ORDER MANAGEMENT =====
export const addOrder = async (order: Omit<Order, "id" | "createdAt">): Promise<string | null> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Order would be stored when Firebase is connected")
      return `offline-order-${Date.now()}`
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    // Ensure the order's userId matches the currently authenticated user
    const services = getFirebaseServices()
    const currentUid = services?.auth?.currentUser?.uid
    if (!currentUid) {
      console.error("❌ No authenticated user for order creation")
      return null
    }
    const sanitizedOrder = {
      ...order,
      userId: currentUid, // enforce rule compliance: request.auth.uid == request.resource.data.userId
    }
    const docRef = await addDoc(collection(db, "orders"), {
      ...sanitizedOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Added order: ${docRef.id}`)
    return docRef.id
  } catch (error) {
    console.error("❌ Error adding order:", error)
    return null
  }
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Order[]

    console.log(`✅ Fetched ${orders.length} orders`)
    return orders
  } catch (error) {
    console.error("❌ Error fetching orders:", error)
    return []
  }
}

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Order[]

    console.log(`✅ Fetched ${orders.length} orders for user: ${userId}`)
    return orders
  } catch (error) {
    console.error("❌ Error fetching orders by user:", error)
    return []
  }
}

export const updateOrderStatus = async (id: string, status: Order["status"]): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Order status would be updated when Firebase is connected")
      return true
    }

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = doc(db, "orders", id)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Updated order ${id} status to ${status}`)
    return true
  } catch (error) {
    console.error(`❌ Error updating order ${id} status:`, error)
    return false
  }
}

export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Order would be deleted when Firebase is connected")
      return true
    }

    const { doc, deleteDoc } = await import("firebase/firestore")
    await deleteDoc(doc(db, "orders", id))

    console.log(`✅ Deleted order: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Error deleting order ${id}:`, error)
    return false
  }
}

// ===== CATEGORY MANAGEMENT =====
export const addCategory = async (category: Omit<Category, "id" | "createdAt">): Promise<string | null> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Category would be stored when Firebase is connected")
      return `offline-category-${Date.now()}`
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: serverTimestamp(),
    })

    console.log(`✅ Added category: ${category.name}`)
    return docRef.id
  } catch (error) {
    console.error("❌ Error adding category:", error)
    return null
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const q = query(collection(db, "categories"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Category[]

    console.log(`✅ Fetched ${categories.length} categories`)
    return categories
  } catch (error) {
    console.error("❌ Error fetching categories:", error)
    return []
  }
}

export const updateCategory = async (id: string, category: Partial<Category>): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Category would be updated when Firebase is connected")
      return true
    }

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = doc(db, "categories", id)
    await updateDoc(docRef, {
      ...category,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Updated category: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Error updating category ${id}:`, error)
    return false
  }
}

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Category would be deleted when Firebase is connected")
      return true
    }

    const { doc, deleteDoc } = await import("firebase/firestore")
    await deleteDoc(doc(db, "categories", id))

    console.log(`✅ Deleted category: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Error deleting category ${id}:`, error)
    return false
  }
}

// ===== STOCK MANAGEMENT =====
export const reduceProductStock = async (productId: string, quantity: number): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Stock would be reduced when Firebase is connected")
      return true
    }

    const { doc, runTransaction, serverTimestamp } = await import("firebase/firestore")
    const productRef = doc(db, "products", productId)

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(productRef)
      if (!snap.exists()) {
        throw new Error(`Product ${productId} not found`)
      }
      const data = snap.data() as Product
      const currentStock = data.stockQuantity || 0
      if (currentStock < quantity) {
        throw new Error(
          `Insufficient stock for product ${productId}. Available: ${currentStock}, Requested: ${quantity}`
        )
      }
      const newStock = currentStock - quantity
      tx.update(productRef, {
        stockQuantity: newStock,
        inStock: newStock > 0,
        updatedAt: serverTimestamp(),
      })
    })

    console.log(`✅ Reduced stock for product ${productId} by ${quantity}`)
    return true
  } catch (error) {
    console.error(`❌ Error reducing stock for product ${productId}:`, error)
    return false
  }
}

export const batchReduceStock = async (items: CartItem[]): Promise<boolean> => {
  try {
    const db = await getDb()
    if (!db) {
      console.log("📝 Stock would be reduced when Firebase is connected")
      return true
    }

    // Process each item in the cart
    for (const item of items) {
      const success = await reduceProductStock(item.id, item.quantity)
      if (!success) {
        console.error(`❌ Failed to reduce stock for ${item.name}`)
        return false
      }
    }

    console.log(`✅ Successfully reduced stock for ${items.length} products`)
    return true
  } catch (error) {
    console.error("❌ Error in batch stock reduction:", error)
    return false
  }
}
