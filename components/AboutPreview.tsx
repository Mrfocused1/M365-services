'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import Link from 'next/link'
import { Features } from './ui/features'
import { Headphones, Cloud, Shield, GraduationCap } from 'lucide-react'

function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const counterRef = useRef(null)
  const isInViewCounter = useInView(counterRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInViewCounter) {
      let startTime: number | null = null
      const duration = 2000 // 2 seconds

      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)

        const currentValue = progress * value
        setDisplayValue(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }

      requestAnimationFrame(animateCount)
    }
  }, [isInViewCounter, value])

  const formattedValue = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)

  return (
    <span ref={counterRef}>{formattedValue}{suffix}</span>
  )
}

export default function AboutPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      id: 1,
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your IT needs. We\'re always here when you need us most.',
      image: '/support.jpeg'
    },
    {
      id: 2,
      icon: Cloud,
      title: 'Cloud Migration',
      description: 'Seamless transitions to the cloud with minimal downtime and maximum efficiency.',
      image: '/cloud.jpeg'
    },
    {
      id: 3,
      icon: Shield,
      title: 'Security First',
      description: 'Enterprise-grade protection keeping your business safe from cyber threats.',
      image: '/security.jpeg'
    },
    {
      id: 4,
      icon: GraduationCap,
      title: 'Training',
      description: 'Empower your team with comprehensive training and ongoing support.',
      image: '/training.jpeg'
    },
  ]

  const stats = [
    { value: 150, suffix: '+', label: 'Happy Clients', decimals: 0 },
    { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
    { value: 24, suffix: '/7', label: 'Support', decimals: 0 },
  ]

  return (
    <section ref={ref} className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-black mb-6">
            Your Perfect IT M365 Partner
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We help small and medium-sized businesses transform the way they work by making technology simple, secure, and productive.
          </p>
        </motion.div>

        {/* Interactive Features Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Features
            features={features}
            primaryColor="bg-sky-500"
            progressGradientLight="bg-gradient-to-r from-sky-500 to-blue-600"
            progressGradientDark="bg-gradient-to-r from-sky-400 to-blue-500"
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center border-4 border-brand-sky hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-poppins text-5xl font-bold mb-2 text-brand-sky">
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/40 inline-block"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl">
              From moving your emails and files to the cloud, to securing your business from cyber threats — we handle it all so you can focus on running your business, not your IT.
            </p>
            <Link
              href="/about"
              className="inline-block bg-white text-brand-sky font-semibold px-8 py-4 rounded-lg border-2 border-brand-sky hover:bg-brand-sky hover:text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
            >
              <span className="flex items-center gap-2">
                Meet the Team
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
