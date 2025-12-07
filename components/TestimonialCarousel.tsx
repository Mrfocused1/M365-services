'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Testimonial {
  id: string
  author_name: string
  author_role: string
  company: string
  quote: string
}

const defaultTestimonials = [
  {
    id: '1',
    author_name: 'Sarah L.',
    author_role: 'Operations Director',
    company: 'London Design Co.',
    quote:
      'M365 IT Services completely transformed how our remote team works — fast, secure, and seamless!',
  },
  {
    id: '2',
    author_name: 'James T.',
    author_role: 'CEO',
    company: 'TechStart Solutions',
    quote:
      'Their expertise in Microsoft 365 helped us scale efficiently without the IT headaches. Highly recommended!',
  },
  {
    id: '3',
    author_name: 'Emma R.',
    author_role: 'Managing Partner',
    company: 'Brighton Consultancy',
    quote:
      'Finally, an IT partner that understands SMBs. Professional, responsive, and cost-effective.',
  },
]

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

      if (!error && data && data.length > 0) {
        setTestimonials(data)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <div className="relative h-64 sm:h-48">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <p className="text-lg md:text-xl text-black italic mb-6 max-w-3xl leading-relaxed">
            "{testimonials[currentIndex].quote}"
          </p>
          <div>
            <p className="font-poppins font-semibold text-black">
              {testimonials[currentIndex].author_name}
            </p>
            <p className="text-gray-600 text-sm">
              {testimonials[currentIndex].author_role},{' '}
              {testimonials[currentIndex].company}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-brand-sky w-8'
                : 'bg-gray-300 hover:bg-brand-sky/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
