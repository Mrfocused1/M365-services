'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FooterData {
  company_name: string
  tagline: string
  copyright_text: string
}

interface ContactInfo {
  phone: string
  email: string
  address: string
}

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  useEffect(() => {
    async function fetchData() {
      // Fetch footer content
      const { data: footerContent } = await supabase
        .from('footer_content')
        .select('*')
        .single()

      if (footerContent) {
        setFooterData(footerContent)
      }

      // Fetch contact info
      const { data: contact } = await supabase
        .from('contact_info')
        .select('*')
        .single()

      if (contact) {
        setContactInfo(contact)
      }
    }

    fetchData()
  }, [])

  // Default values if database hasn't loaded yet
  const companyName = footerData?.company_name || 'M365 IT Services'
  const tagline = footerData?.tagline || 'Empowering businesses through Microsoft 365'
  const copyrightText = footerData?.copyright_text || `© ${new Date().getFullYear()} M365 IT SERVICES. All rights reserved.`
  const phone = contactInfo?.phone || '020 4582 5950'
  const email = contactInfo?.email || 'info@m365itservices.co.uk'
  const address = contactInfo?.address || 'London, UK'

  return (
    <footer ref={ref} className="bg-gradient-to-b from-white to-gray-50 text-black py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-start">
            <div className="mb-4">
              <img
                src="/Logo.svg"
                alt={companyName}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">
              {tagline}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-poppins font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {(['Home', 'Services', 'About Us', 'Contact'] as const).map((item, index) => {
                const hrefs: Record<string, string> = { 'Home': '/', 'Services': '/#services', 'About Us': '/about', 'Contact': '/#contact' }
                return (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={hrefs[item]}
                      className="text-gray-600 hover:text-brand-sky transition-colors"
                    >
                      {item}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-poppins font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="text-gray-600"
              >
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="hover:text-brand-sky transition-colors"
                >
                  {phone}
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="text-gray-600"
              >
                <a
                  href={`mailto:${email}`}
                  className="hover:text-brand-sky transition-colors"
                >
                  {email}
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="text-gray-600"
              >
                <span>{address}</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="border-t border-gray-200 mt-8 pt-8 text-center"
        >
          <p className="text-gray-600 text-sm">
            {copyrightText}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
