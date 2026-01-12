"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Product, Category } from "@/types"
import { getProductsByCategory, getCategories } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getCategories()

        // 1. EXACT NAMES JO AAPNE CONSOLE MEIN DEKHE
        const allowed = ["Booster Box", "Blister", "Psa", "Raw Card"]

        const filtered = all.filter((c) =>
          allowed.includes(c.name.trim())
        )

        // Debugging ke liye (iske niche 4 naam aane chahiye)
        console.log("Ab sirf ye 4 cards hain:", filtered.map(cat => cat.name))

        setCategories(filtered)
      } catch (error) {
        console.error(error)
      } finally {
        setIsMounted(true)
      }
    }
    fetchData()
  }, [])

  const handleCategoryCardClick = (slug: string) => {
    router.push(`/products?category=${slug}`)
  }

  if (!isMounted) return <div className="h-24" />

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-[#1f1f1f] to-[#121212]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-10">
          <button onClick={() => router.push("/products")} className="bg-gray-600 text-white px-5 py-2 rounded-lg">
            All Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryCardClick(category.slug)}
              className="cursor-pointer rounded-[14px] border border-[#212121] bg-white overflow-hidden text-center shadow-lg"
            >
              <div className="relative w-full pt-[100%]">
                <Image
                  src={
                    category.name === "Booster Box" ? "/booster.webp" :
                      category.name === "Raw Card" ? "/Raw-cards.webp" :
                        `/${category.slug}.webp`
                  }
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>


              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#212121] mb-4 uppercase">
                  {category.name === "Blister" ? "Bundles" : category.name}
                </h3>
                <button className="bg-[#212121] text-white font-bold px-6 py-2 rounded-lg w-full">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

