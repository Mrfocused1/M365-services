'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { TestimonialsSection } from './ui/testimonials-section'
import { supabase } from '@/lib/supabase'
import type { Benefit, Testimonial } from '@/lib/supabase'

// Default fallback data
const defaultBenefits = [
  {
    title: 'Scalability',
    description: 'Pay only for what you need and grow later',
    image: '/scalability.jpeg',
  },
  {
    title: 'Secure',
    description: 'Enterprise-grade security for your business',
    image: '/secure.jpeg',
  },
  {
    title: 'Cost-Effective',
    description: 'Reduce IT costs with cloud solutions',
    image: '/cost.jpeg',
  },
  {
    title: 'Productivity-Boosting',
    description: 'Empower your team to work smarter',
    image: '/productivity.jpeg',
  },
]

const defaultTestimonials = [
  {
    author: {
      name: 'Sarah L.',
      role: 'Operations Director',
      company: 'London Design Co.',
    },
    text: 'M365 IT Services completely transformed how our remote team works — fast, secure, and seamless!',
  },
  {
    author: {
      name: 'James T.',
      role: 'CEO',
      company: 'TechStart Solutions',
    },
    text: 'Their expertise in Microsoft 365 helped us scale efficiently without the IT headaches. Highly recommended!',
  },
  {
    author: {
      name: 'Emma R.',
      role: 'Managing Partner',
      company: 'Brighton Consultancy',
    },
    text: 'Finally, an IT partner that understands SMBs. Professional, responsive, and cost-effective.',
  },
]

export default function WhyChoose() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [benefits, setBenefits] = useState(defaultBenefits)
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [showTestimonials, setShowTestimonials] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch benefits
      const { data: benefitsData, error: benefitsError } = await supabase
        .from('benefits')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

      if (!benefitsError && benefitsData && benefitsData.length > 0) {
        setBenefits(benefitsData.map(b => ({
          title: b.title,
          description: b.description,
          image: b.image_url || '/scalability.jpeg'
        })))
      }

      // Fetch testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

      if (!testimonialsError && testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData.map(t => ({
          author: {
            name: t.author_name,
            role: t.author_role,
            company: t.author_company
          },
          text: t.text
        })))
      }

      // Check if testimonials section should be visible
      // We'll store this in a settings table or use a simple flag
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('show_testimonials')
        .single()

      if (settingsData) {
        setShowTestimonials(settingsData.show_testimonials ?? true)
      }
    } catch (error) {
      console.error('Error fetching Why Choose data:', error)
      // Keep using defaults
    }
  }

  return (
    <section ref={ref} className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6">
            Why choose M365 IT Services for your business?
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto">
            All in one tool — Email, Teams, Office Apps, Storage, Strong Security,
            and Easy Collaboration.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden w-full max-w-sm sm:max-w-none h-48 md:h-56"
              style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)' }}
            >
              <img
                src={benefit.image}
                alt={benefit.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-left">
                <h3 className="font-poppins text-xl md:text-2xl font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base text-white/90">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Marquee Section - Conditionally Rendered */}
      {showTestimonials && testimonials.length > 0 && (
        <TestimonialsSection
          title="What Our Clients Say"
          description="Trusted by businesses across the UK"
          testimonials={testimonials}
          className="mt-10 md:mt-20"
        />
      )}
    </section>
  )
}
