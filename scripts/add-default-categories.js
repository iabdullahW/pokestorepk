// Script to add default categories to Firebase
// Run this in the browser console or as a Node.js script

const defaultCategories = [
  {
    name: "Soap",
    slug: "soap",
    description: "Handcrafted organic soaps for daily cleansing and skincare"
  },
  {
    name: "Shampoo", 
    slug: "shampoo",
    description: "Natural hair care products for healthy and beautiful hair"
  },
  {
    name: "Oil",
    slug: "oil", 
    description: "Pure organic oils for hair and skin nourishment"
  },
  {
    name: "Lip Balm",
    slug: "lip-balm",
    description: "Moisturizing lip care products for soft and healthy lips"
  }
];

// Function to add categories (for browser console use)
async function addDefaultCategories() {
  try {
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { initializeApp } = await import('firebase/app');
    
    // Initialize Firebase (you'll need to import your config)
    const firebaseConfig = {
      apiKey: "AIzaSyCPYT5X-JXQ3r1Oh1HvjZMmUIp55jllZg8",
      authDomain: "pokemonstore-af18a.firebaseapp.com",
      projectId: "pokemonstore-af18a",
      storageBucket: "pokemonstore-af18a.firebasestorage.app",
      messagingSenderId: "856938163252",
      appId: "1:856938163252:web:8aacee1da06907f8056e61"
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log("🚀 Adding default categories...");
    
    for (const category of defaultCategories) {
      const docRef = await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ Added category: ${category.name} (${docRef.id})`);
    }
    
    console.log("🎉 All default categories added successfully!");
    console.log("📝 You can now add products with these categories in the admin panel!");
  } catch (error) {
    console.error("❌ Error adding categories:", error);
  }
}

// Export for Node.js use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addDefaultCategories, defaultCategories };
}

// For browser console use
if (typeof window !== 'undefined') {
  window.addDefaultCategories = addDefaultCategories;
  console.log("📝 Run addDefaultCategories() to add default categories");
  console.log("📝 Or copy this script to your browser console and run it");
} 