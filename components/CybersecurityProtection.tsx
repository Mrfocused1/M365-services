'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Shield, Mail, GraduationCap, Lock, Eye, AlertTriangle, FileCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CybersecurityService } from '@/lib/supabase'

// Icon map to convert string names to components
const iconMap: Record<string, any> = {
  Shield,
  Mail,
  GraduationCap,
  Lock,
  Eye,
  AlertTriangle,
  FileCheck
}

// Default fallback services for build time
const defaultServices: CybersecurityService[] = [
  {
    id: '1',
    title: '24/7 Threat Detection & Rapid Response',
    description: '24/7 threat detection and rapid response to cyber incidents via MS Defender',
    icon_name: 'Shield',
    position: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Advanced Email Protection',
    description: 'Advanced email protection against phishing and spam.',
    icon_name: 'Mail',
    position: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Staff Training',
    description: 'Staff training to stop attacks before they happen.',
    icon_name: 'GraduationCap',
    position: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function CybersecurityProtection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [protectionServices, setProtectionServices] = useState<CybersecurityService[]>(defaultServices)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const { data, error} = await supabase
        .from('cybersecurity_services')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setProtectionServices(data)
      }
    } catch (error) {
      console.error('Error fetching cybersecurity services:', error)
      // Keep using defaultServices on error
    }
  }

  return (
    <section ref={ref} className="section-spacing bg-brand-sky relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Cybersecurity Protection
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto">
            Comprehensive security services designed to protect and empower your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {protectionServices.map((service, index) => {
            const Icon = iconMap[service.icon_name] || Shield

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white rounded-2xl p-5 md:p-8 border border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}
              >
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-brand-sky/10 rounded-xl mb-4 md:mb-6 mx-auto">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-brand-sky" />
                </div>
                <h3 className="font-poppins text-lg md:text-xl font-bold text-black mb-3 md:mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <a
            href="#contact"
            className="inline-block bg-white text-brand-sky font-semibold px-8 md:px-10 py-3 md:py-4 text-sm md:text-base rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Secure Your Business Today
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
