'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
                alt="M365 IT Services"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Empowering businesses through Microsoft 365
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
                  href="tel:02045825950"
                  className="hover:text-brand-sky transition-colors"
                >
                  020 4582 5950
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="text-gray-600"
              >
                <a
                  href="mailto:info@m365itservices.co.uk"
                  className="hover:text-brand-sky transition-colors"
                >
                  info@m365itservices.co.uk
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="text-gray-600"
              >
                <span>London, UK</span>
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
            © {new Date().getFullYear()} M365 IT SERVICES. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
