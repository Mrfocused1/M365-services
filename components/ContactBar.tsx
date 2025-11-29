'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { ContactInfo } from '@/lib/supabase'

export default function ContactBar() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  async function fetchContactInfo() {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single()

      if (error) throw error
      setContactInfo(data)
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }

  const phoneNumber = contactInfo?.phone_number || '020 4582 5950'
  const phoneLink = phoneNumber.replace(/\s/g, '')

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="fixed top-20 left-0 right-0 z-40 bg-purple-600"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-3">
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            href={`tel:${phoneLink}`}
            className="text-white hover:text-gray-100 transition-colors font-medium"
          >
            <span className="text-lg">{phoneNumber}</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
