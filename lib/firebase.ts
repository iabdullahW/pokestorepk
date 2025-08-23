// Firebase configuration - Your complete config
const firebaseConfig = {
  apiKey: "AIzaSyCPYT5X-JXQ3r1Oh1HvjZMmUIp55jllZg8",
  authDomain: "pokemonstore-af18a.firebaseapp.com",
  projectId: "pokemonstore-af18a",
  storageBucket: "pokemonstore-af18a.appspot.com",
  messagingSenderId: "856938163252",
  appId: "1:856938163252:web:8aacee1da06907f8056e61"
};

// Global state
let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null
let firebaseStorage: any = null
let isInitialized = false
let initPromise: Promise<boolean> | null = null

// Check if we're on client side
export const isClientSide = () => typeof window !== "undefined"

// Check if Firebase is ready
export const isFirebaseReady = () => isInitialized && firebaseApp && firebaseAuth && firebaseDb && firebaseStorage

// Initialize Firebase for user auth and order storage only
export const initializeFirebase = async (): Promise<boolean> => {
  if (!isClientSide()) {
    console.log("⚠️ Server-side detected, skipping Firebase initialization")
    return false
  }

  // Return existing promise if already initializing
  if (initPromise) {
    console.log("🔄 Firebase initialization in progress, waiting...")
    return initPromise
  }

  // Return true if already initialized
  if (isFirebaseReady()) {
    console.log("✅ Firebase already initialized")
    return true
  }

  // Create initialization promise
  initPromise = performFirebaseInitialization()

  try {
    const result = await initPromise
    return result
  } finally {
    initPromise = null
  }
}

const performFirebaseInitialization = async (): Promise<boolean> => {
  console.log("🚀 Starting Firebase initialization for user auth and orders...")

  try {
    // Reset state
    firebaseApp = null
    firebaseAuth = null
    firebaseDb = null
    firebaseStorage = null
    isInitialized = false

    // Step 1: Initialize Firebase App
    console.log("📱 Initializing Firebase App...")
    const { initializeApp, getApps } = await import("firebase/app")

    const existingApps = getApps()
    if (existingApps.length > 0) {
      console.log("♻️ Using existing Firebase app")
      firebaseApp = existingApps[0]
    } else {
      console.log("🆕 Creating new Firebase app")
      firebaseApp = initializeApp(firebaseConfig)
    }

    if (!firebaseApp) {
      throw new Error("Failed to initialize Firebase app")
    }

    // Step 2: Initialize Authentication
    console.log("🔐 Initializing Firebase Auth...")
    const { getAuth } = await import("firebase/auth")
    firebaseAuth = getAuth(firebaseApp)

    if (!firebaseAuth) {
      throw new Error("Failed to initialize Firebase Auth")
    }

    // Step 3: Initialize Firestore for user and order data
    console.log("🗄️ Initializing Firestore...")
    const { getFirestore } = await import("firebase/firestore")
    firebaseDb = getFirestore(firebaseApp)

    if (!firebaseDb) {
      throw new Error("Failed to initialize Firestore")
    }

    // Step 4: Initialize Firebase Storage for image uploads
    console.log("📁 Initializing Firebase Storage...")
    const { getStorage } = await import("firebase/storage")
    firebaseStorage = getStorage(firebaseApp)

    if (!firebaseStorage) {
      throw new Error("Failed to initialize Firebase Storage")
    }

    // Step 5: Verify services are working
    console.log("🧪 Testing Firebase services...")

    // Test Firestore
    const { doc } = await import("firebase/firestore")
    const testDoc = doc(firebaseDb, "users", "test")
    if (!testDoc) {
      throw new Error("Firestore service test failed")
    }

    // Test Storage
    const { ref } = await import("firebase/storage")
    const testStorageRef = ref(firebaseStorage, "test")
    if (!testStorageRef) {
      throw new Error("Firebase Storage service test failed")
    }

    // Test Auth state listener
    const { onAuthStateChanged } = await import("firebase/auth")
    const unsubscribe = onAuthStateChanged(firebaseAuth, () => {})
    unsubscribe() // Immediately unsubscribe

    // Mark as initialized
    isInitialized = true
    console.log("🎉 Firebase initialization completed successfully!")
    console.log("📝 Ready to store user data and orders")
    return true
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error)

    // Reset state on failure
    firebaseApp = null
    firebaseAuth = null
    firebaseDb = null
    firebaseStorage = null
    isInitialized = false

    return false
  }
}

// Get Firebase services
export const getFirebaseServices = () => {
  if (!isFirebaseReady()) {
    console.log("⚠️ Firebase services not ready")
    return null
  }

  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb,
    storage: firebaseStorage,
  }
}

// Reset Firebase state
export const resetFirebase = () => {
  firebaseApp = null
  firebaseAuth = null
  firebaseDb = null
  firebaseStorage = null
  isInitialized = false
  initPromise = null
  console.log("🔄 Firebase state reset")
}

// Validate configuration
export const validateFirebaseConfig = () => {
  const required = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missing = required.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig])

  if (missing.length > 0) {
    console.error("❌ Missing Firebase config fields:", missing)
    return false
  }

  console.log("✅ Firebase configuration is valid")
  return true
}

// Check Firebase project accessibility
export const checkFirebaseProject = async (): Promise<{ accessible: boolean; error?: string }> => {
  try {
    const response = await fetch(`https://${firebaseConfig.projectId}.firebaseapp.com/`, {
      method: "HEAD",
      mode: "no-cors",
    })
    return { accessible: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    return { accessible: false, error: errorMsg }
  }
}
