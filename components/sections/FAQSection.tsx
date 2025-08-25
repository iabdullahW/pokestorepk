"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView, Variants } from "framer-motion"
import { FiArrowDownRight, FiArrowUpLeft } from "react-icons/fi"

// 1) containerVariants – unchanged (it doesn’t use ease)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// 2) itemVariants – fix the ease value

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",   // now accepted
    },
  },
};

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: '0px 0px -200px 0px',
  })

  const faqs = [
    {
      question: "How is the quality of cards?",
      answer: "The cards are top notch and in premium quality."
    },
    {
      question: "How many days it take for delivery?",
      answer: "It takes 2-5 days for delivery."
    },
    {
      question: "How about the packs and bundle offers?",
      answer: "We offer a variety of packs and bundle offers to make shopping more convenient."
    },
    {
      question: "Is the price too expensive?",
      answer: "No, the price is very affordable."
    },
    {
      question: "Can I return products or refund?",
      answer: "No, we don't offer returns or refunds."
    },
   
  ]

  return (
    <section id="faqs" className="bg-white" ref={sectionRef}>
      {/* Header */}
      <div className="px-6 lg:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-6xl lg:text-8xl font-medium text-[#212121] tracking-tight">
            FAQ'S
          </h1>
        </motion.div>
      </div>

      {/* FAQ Items */}
      <motion.div 
        className="border-t border-gray-300"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="border-b border-gray-300"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full px-6 lg:px-20 py-6 lg:py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
              whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
            >
              <h3 className="text-lg lg:text-xl font-light text-[#212121] pr-4 leading-tight">
                {faq.question}
              </h3>
              
              <motion.div
                animate={{ rotate: openFAQ === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0"
              >
                {openFAQ === index ? (
                  <FiArrowUpLeft className="w-6 h-6 text-[#212121]" />
                ) : (
                  <FiArrowDownRight className="w-6 h-6 text-[#212121]" />
                )}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openFAQ === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden bg-gray-50"
                >
                  <div className="px-6 lg:px-20 pb-6 lg:pb-8">
                    <p className="text-gray-700 leading-relaxed text-base lg:text-lg max-w-4xl">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}