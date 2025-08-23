"use client"
import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FiShoppingCart, FiHeart } from "react-icons/fi"
import type { Product } from "@/types"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  onAddToCart?: () => void
}

export default function ProductCard({ product, className, onAddToCart, ...props }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check stock availability
    if ((product.stockQuantity || 0) < 1) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      })
      return
    }
    
    try {
      await addToCart(product)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  return (
    <div
      {...props}
      onClick={handleCardClick}
      className={`group relative product-card-dusty-rose ${
        (product.stockQuantity || 0) > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-75"
      } ${className || ''}`}
    >
      {/* Image Container - Tall aspect ratio with hover effect only on image */}
      <div className="relative w-full overflow-hidden rounded-[7px]" style={{ paddingBottom: "125.8%" }}>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="200px"
            className="object-cover w-full"
            priority={true}
          />
        </motion.div>
        
        {/* Floating Action Buttons */}
        <button
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAddToCart) {
              onAddToCart();
            } else {
              handleAddToCart(e);
            }
            return false;
          }}
          onMouseDown={e => e.stopPropagation()}
          aria-label="Add to cart"
        >
          <FiShoppingCart size={20} />
        </button>
        
        {/* Stock Badge */}
        <div className="absolute bottom-2 left-6">
          <span className={`px-2 py-1 backdrop-blur-sm text-white text-xs font-medium rounded-full border ${
            (product.stockQuantity || 0) > 10 ? "bg-green-600 border-green-200/50" :
            (product.stockQuantity || 0) > 0 ? "bg-yellow-600 border-yellow-200/50" :
            "bg-red-600 border-red-200/50"
          }`}>
            {(product.stockQuantity || 0) > 0 ? `${product.stockQuantity} left` : "Out of Stock"}
          </span>
        </div>
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute bottom-2 right-6">
            <span className="px-1 py-1 bg-[#212121] backdrop-blur-sm text-white text-xs font-medium rounded-full border border-rose-200/50">
              {product.category}
            </span>
          </div>
        )}
        {/* Sale Tag for Booster */}
        {product.category === "booster" && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-[#212121] text-white text-xs font-bold rounded-[10px] shadow-md">
              SALE
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="pt-2 ">
        <div className="mb-4">
          <h3 className={`font-Montserrat text-base md:text-lg lg:text-xl font-extrabold mb-2 transition-colors duration-300 line-clamp-2 ${
            (product.stockQuantity || 0) > 0 ? "text-white" : "text-gray-400"
          }`}>
            {product.name}
          </h3>
          <div className="flex flex-col">
            <span className={`text-xl md:text-2xl font-bold bg-clip-text text-transparent ${
              (product.stockQuantity || 0) > 0 ? "bg-[#ffffff]" : "bg-gray-400"
            }`}>
              <span className="text-[16px]">Rs</span>{product.price}
            </span>
            {(product.stockQuantity || 0) < 1 && (
              <span className="text-sm text-red-400 mt-1">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-dusty-rose-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  )
}