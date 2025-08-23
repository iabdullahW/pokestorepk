// Simple script to add test products for search functionality
// Run this in the browser console

const testProducts = [
  {
    name: "Rose Glow Soap",
    description: "Luxurious handmade soap with rose petals and natural oils. This premium soap is crafted with the finest organic ingredients.",
    price: 299,
    image: "/placeholder.svg?height=400&width=400&text=Rose+Glow+Soap&bg=f9a8d4",
    category: "soap",
    inStock: true,
  },
  {
    name: "Lavender Dreams Shampoo",
    description: "Gentle organic shampoo for all hair types. Formulated with pure lavender essential oil and organic botanicals.",
    price: 599,
    image: "/placeholder.svg?height=400&width=400&text=Lavender+Shampoo&bg=c084fc",
    category: "shampoo",
    inStock: true,
  },
  {
    name: "Argan Miracle Oil",
    description: "Pure argan oil for hair and skin nourishment. Sourced directly from Morocco, rich in vitamin E and antioxidants.",
    price: 899,
    image: "/placeholder.svg?height=400&width=400&text=Argan+Oil&bg=fbbf24",
    category: "oil",
    inStock: true,
  },
  {
    name: "Berry Bliss Lip Balm",
    description: "Nourishing lip balm with natural berry extracts. This hydrating lip balm provides long-lasting moisture.",
    price: 199,
    image: "/placeholder.svg?height=400&width=400&text=Berry+Lip+Balm&bg=ec4899",
    category: "lip-balm",
    inStock: true,
  }
]

async function addTestProducts() {
  try {
    console.log("🚀 Adding test products...")
    
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
    
    for (const product of testProducts) {
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
    console.log(`\n🎉 Test products added successfully!`)
    console.log(`\n🔍 Now you can test the search functionality:`)
    console.log(`- Search for "soap" to find Rose Glow Soap`)
    console.log(`- Search for "shampoo" to find Lavender Dreams Shampoo`)
    console.log(`- Search for "oil" to find Argan Miracle Oil`)
    console.log(`- Search for "lip balm" to find Berry Bliss Lip Balm`)
    console.log(`- Search for "rose" to find Rose Glow Soap`)
    console.log(`- Search for "berry" to find Berry Bliss Lip Balm`)
    
  } catch (error) {
    console.error("❌ Error in addTestProducts:", error)
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.addTestProducts = addTestProducts
  console.log("📝 Run addTestProducts() to add test products")
  console.log("📝 Or copy this script to your browser console and run it")
} 