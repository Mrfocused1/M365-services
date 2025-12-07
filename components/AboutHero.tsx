'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { AboutContent } from '@/lib/supabase'

const defaultContent = {
  hero_title: 'Your Perfect IT M365 Partner',
  hero_subtitle: 'I help small and medium-sized businesses transform the way they work by making technology simple, secure, and productive.',
  hero_description: 'From moving your emails and files to the cloud, to securing your business from cyber threats, to giving your team the tools they need to work from anywhere — I handle it all so you can focus on running your business, not your IT via M365 Services.'
}

export default function AboutHero() {
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .single()

        if (!error && data) {
          setContent({
            hero_title: data.hero_title || defaultContent.hero_title,
            hero_subtitle: data.hero_subtitle || defaultContent.hero_subtitle,
            hero_description: data.hero_description || defaultContent.hero_description
          })
        }
      } catch (error) {
        console.error('Error fetching about content:', error)
      }
    }
    fetchContent()
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-sky rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6 px-6 py-2 bg-brand-sky/10 rounded-full"
          >
            <span className="text-brand-sky font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
          </motion.div>

          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            {content.hero_title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            {content.hero_subtitle}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            {content.hero_description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
