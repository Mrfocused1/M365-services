'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const services = [
    {
      title: '24/7 Threat Detection & Rapid Response',
      description:
        'Advanced monitoring and protection via Microsoft Defender to keep your business safe around the clock.',
    },
    {
      title: 'Advanced Email Protection',
      description:
        'Comprehensive phishing and spam filtering to protect your team from email-based threats and attacks.',
    },
    {
      title: 'Staff Training',
      description:
        'Empower your team with security awareness training to stop cyber attacks before they happen.',
    },
  ]

  return (
    <section
      id="services"
      ref={ref}
      className="section-spacing bg-brand-sky relative overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-white mb-6">
            Microsoft 365 Setup & Optimisation
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Comprehensive M365 services designed to protect and empower your
            business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-2xl p-8 border border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}
            >
              <h3 className="font-poppins text-xl font-bold text-black mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="inline-block bg-white text-brand-sky font-semibold px-10 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started Today
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
