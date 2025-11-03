'use client'

import { motion } from 'framer-motion'

export default function ContactBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="fixed top-20 left-0 right-0 z-40 bg-brand-sky"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-3">
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            href="tel:02045825950"
            className="text-white hover:text-gray-100 transition-colors font-medium"
          >
            <span className="text-lg">020 4582 5950</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
