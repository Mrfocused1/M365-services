'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'M365 Service', href: '/#services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/#contact' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="flex flex-col items-start">
              <span className="font-bold text-xl text-black">
                M365 IT SERVICES
              </span>
              <span className="text-xs text-gray-600 font-medium mt-0.5">
                Experts in Microsoft 365 for SMEs
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  className={`text-base font-medium transition-colors hover:text-brand-sky ${
                    pathname === item.href
                      ? 'text-brand-sky'
                      : 'text-black'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-black transition-all ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-black transition-all ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-black transition-all ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pb-4"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`block py-3 text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-brand-sky'
                      : 'text-black hover:text-brand-sky'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
