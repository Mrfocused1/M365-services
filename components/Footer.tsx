'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 text-black py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <span className="font-poppins font-bold text-xl">M365 IT SERVICES</span>
              <p className="text-xs text-gray-600 mt-1">Experts in Microsoft 365 for SMEs</p>
            </div>
            <p className="text-gray-600 text-sm">
              Empowering businesses through Microsoft 365
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-brand-sky transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-gray-600 hover:text-brand-sky transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-brand-sky transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-600 hover:text-brand-sky transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="text-gray-600">
                <a
                  href="tel:02045825950"
                  className="hover:text-brand-sky transition-colors"
                >
                  020 4582 5950
                </a>
              </li>
              <li className="text-gray-600">
                <a
                  href="mailto:info@m365itservices.co.uk"
                  className="hover:text-brand-sky transition-colors"
                >
                  info@m365itservices.co.uk
                </a>
              </li>
              <li className="text-gray-600">
                <span>London, UK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} M365 IT SERVICES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
