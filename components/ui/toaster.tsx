"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`max-w-sm w-full bg-white rounded-lg shadow-lg border p-4 ${
              toast.variant === "destructive" ? "border-red-200" : "border-green-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full ${toast.variant === "destructive" ? "bg-red-100" : "bg-green-100"}`}>
                {toast.variant === "destructive" ? (
                  <FiAlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <FiCheck className="w-4 h-4 text-green-600" />
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{toast.title}</h4>
                {toast.description && <p className="text-sm text-gray-600 mt-1">{toast.description}</p>}
              </div>

              <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
