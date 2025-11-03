'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Shield, Cloud, HeartHandshake } from 'lucide-react'

export default function AboutContent() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const values = [
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your success is our priority. We tailor every solution to fit your unique business needs.',
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Protecting your data and business with enterprise-grade security measures.',
    },
    {
      icon: Cloud,
      title: 'Cloud Experts',
      description: 'Specializing in Microsoft 365 cloud solutions that scale with your business.',
    },
    {
      icon: HeartHandshake,
      title: 'Always Available',
      description: '24/7 support to ensure your business never stops running smoothly.',
    },
  ]

  const team = [
    {
      name: 'David M.',
      title: 'Lead Solutions Architect',
      bio: 'Microsoft Certified Expert with 10+ years in cloud infrastructure and M365 deployment.',
      image: '/team1.jpeg'
    },
    {
      name: 'Sophie K.',
      title: 'Security Specialist',
      bio: 'Cybersecurity professional specialising in threat detection and compliance.',
      image: '/team2.jpeg'
    },
    {
      name: 'James P.',
      title: 'Migration Consultant',
      bio: 'Expert in seamless cloud migrations and business continuity planning.',
      image: '/team3.jpeg'
    },
    {
      name: 'Rachel L.',
      title: 'Training & Support Lead',
      bio: 'Dedicated to empowering teams through comprehensive M365 training programs.',
      image: '/team4.jpeg'
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Who We Are */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-black mb-6">
            Who We Are
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We are a group of young, extremely knowledgeable IT professionals who specialise in M365 cloud computing services which can help transform your small and medium-sized business to reach its full potential.
          </p>
        </motion.div>

        {/* Our Values - 4 Icon Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 text-center"
                  style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-brand-sky/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-brand-sky" />
                  </div>
                  <h3 className="font-poppins text-lg font-bold text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Meet the Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-black text-center mb-4">
            Meet the Team
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our experts are Microsoft-certified professionals with years of experience in security, cloud migration, and M365 optimisation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-sky/20 to-blue-600/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-poppins text-xl font-bold text-black mb-2">
                    {member.name}
                  </h3>
                  <p className="text-brand-sky font-medium mb-3 text-sm">
                    {member.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-10 md:p-16 border border-white/40 inline-block"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-black mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Let's discuss how our M365 solutions can help you work smarter, safer, and more efficiently.
            </p>
            <a
              href="/#contact"
              className="inline-block bg-gradient-to-r from-brand-sky to-blue-600 text-white font-semibold px-10 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
