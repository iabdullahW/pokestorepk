// Script to add sample products for testing search functionality
// Run this in the browser console or as a Node.js script

const sampleProducts = [
  {
    name: "Rose Glow Soap",
    description: "Luxurious handmade soap with rose petals and natural oils. This premium soap is crafted with the finest organic ingredients to provide a gentle yet effective cleansing experience.",
    price: 299,
    image: "/placeholder.svg?height=400&width=400&text=Rose+Glow+Soap&bg=f9a8d4",
    category: "soap",
    inStock: true,
  },
  {
    name: "Lavender Dreams Shampoo",
    description: "Gentle organic shampoo for all hair types. Formulated with pure lavender essential oil and organic botanicals, this shampoo cleanses without stripping natural oils.",
    price: 599,
    image: "/placeholder.svg?height=400&width=400&text=Lavender+Shampoo&bg=c084fc",
    category: "shampoo",
    inStock: true,
  },
  {
    name: "Argan Miracle Oil",
    description: "Pure argan oil for hair and skin nourishment. Sourced directly from Morocco, this 100% pure argan oil is rich in vitamin E, essential fatty acids, and antioxidants.",
    price: 899,
    image: "/placeholder.svg?height=400&width=400&text=Argan+Oil&bg=fbbf24",
    category: "oil",
    inStock: true,
  },
  {
    name: "Honey Oat Soap",
    description: "Moisturizing soap with honey and oatmeal. This gentle exfoliating soap combines the moisturizing properties of honey with the gentle scrubbing action of oatmeal.",
    price: 249,
    image: "/placeholder.svg?height=400&width=400&text=Honey+Oat+Soap&bg=f59e0b",
    category: "soap",
    inStock: true,
  },
  {
    name: "Tea Tree Shampoo",
    description: "Clarifying shampoo for oily hair. Formulated with natural tea tree oil, this shampoo effectively cleanses oily hair and scalp while preventing dandruff.",
    price: 549,
    image: "/placeholder.svg?height=400&width=400&text=Tea+Tree+Shampoo&bg=10b981",
    category: "shampoo",
    inStock: true,
  },
  {
    name: "Jojoba Face Oil",
    description: "Lightweight oil perfect for facial care. This premium jojoba oil closely mimics your skin's natural sebum, making it perfect for all skin types.",
    price: 799,
    image: "/placeholder.svg?height=400&width=400&text=Jojoba+Oil&bg=06b6d4",
    category: "oil",
    inStock: true,
  },
  {
    name: "Coconut Milk Soap",
    description: "Creamy soap with coconut milk and vanilla. This luxurious soap combines the moisturizing properties of coconut milk with the sweet scent of vanilla.",
    price: 279,
    image: "/placeholder.svg?height=400&width=400&text=Coconut+Soap&bg=f3f4f6",
    category: "soap",
    inStock: true,
  },
  {
    name: "Berry Bliss Lip Balm",
    description: "Nourishing lip balm with natural berry extracts. This hydrating lip balm provides long-lasting moisture and a subtle berry tint.",
    price: 199,
    image: "/placeholder.svg?height=400&width=400&text=Berry+Lip+Balm&bg=ec4899",
    category: "lip-balm",
    inStock: true,
  },
  {
    name: "Vanilla Dream Lip Balm",
    description: "Smooth vanilla lip balm for soft, hydrated lips. This creamy lip balm with vanilla extract provides intense hydration and a sweet vanilla scent.",
    price: 179,
    image: "/placeholder.svg?height=400&width=400&text=Vanilla+Lip+Balm&bg=fbbf24",
    category: "lip-balm",
    inStock: true,
  },
  {
    name: "Mint Fresh Lip Balm",
    description: "Refreshing mint lip balm with cooling sensation. This invigorating lip balm with peppermint oil provides a cooling effect and fresh breath.",
    price: 189,
    image: "/placeholder.svg?height=400&width=400&text=Mint+Lip+Balm&bg=10b981",
    category: "lip-balm",
    inStock: true,
  }
]

async function addSampleProducts() {
  try {
    console.log("🚀 Adding sample products...")
    
    // Import Firebase functions
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js')
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js')
    
    // Initialize Firebase with your actual config
    const firebaseConfig = {
      apiKey: "AIzaSyCPYT5X-JXQ3r1Oh1HvjZMmUIp55jllZg8",
      authDomain: "pokemonstore-af18a.firebaseapp.com",
      projectId: "pokemonstore-af18a",
      storageBucket: "pokemonstore-af18a.firebasestorage.app",
      messagingSenderId: "856938163252",
      appId: "1:856938163252:web:8aacee1da06907f8056e61"
    };
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of sampleProducts) {
      try {
        const docRef = await addDoc(collection(db, "products"), {
          ...product,
          createdAt: serverTimestamp(),
        })
        console.log(`✅ Added product: ${product.name} (ID: ${docRef.id})`)
        successCount++
      } catch (error) {
        console.error(`❌ Error adding ${product.name}:`, error)
        errorCount++
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`✅ Successfully added: ${successCount} products`)
    console.log(`❌ Errors: ${errorCount} products`)
    console.log(`\n🎉 Sample products added successfully!`)
    console.log(`\n🔍 Now you can test the search functionality with these products:`)
    console.log(`- Search for "soap" to find soap products`)
    console.log(`- Search for "shampoo" to find shampoo products`)
    console.log(`- Search for "oil" to find oil products`)
    console.log(`- Search for "lip balm" to find lip balm products`)
    console.log(`- Search for "rose" to find rose-related products`)
    console.log(`- Search for "vanilla" to find vanilla products`)
    
  } catch (error) {
    console.error("❌ Error in addSampleProducts:", error)
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.addSampleProducts = addSampleProducts
  console.log("📝 Run addSampleProducts() to add sample products")
  console.log("📝 Or copy this script to your browser console and run it")
} 