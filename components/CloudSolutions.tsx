'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, Shield, Cloud, Smartphone, Mail, Lock, Phone, Key } from 'lucide-react'

export default function CloudSolutions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const solutions = [
    {
      icon: Cloud,
      title: 'Secure Backups & Disaster Recovery',
      description: 'Use Microsoft 365 Backup to keep business data safe. Quick recovery options in case of data loss or system failure.',
    },
    {
      icon: Lock,
      title: 'Remote & Secure Access',
      description: 'Enable staff to work from anywhere. Protected sign-ins and secure connections for remote work.',
    },
    {
      icon: Smartphone,
      title: 'Endpoint Deployment & Management (via Intune)',
      description: 'Install and manage business apps across all company devices. Keep devices updated and secure from a single dashboard.',
    },
    {
      icon: Mail,
      title: 'Email Security & Collaboration',
      description: 'Apply Defender 365 email policies. Reduce phishing, spam, and malware risks. Ensure safe, reliable business communication.',
    },
    {
      icon: Shield,
      title: 'Endpoint Cybersecurity (via Defender for Endpoint)',
      description: 'Protect laptops, PCs, and mobile devices from cyber threats. Monitor and respond quickly to security issues.',
    },
    {
      icon: Phone,
      title: 'Microsoft Teams Telephony',
      description: 'Set up Auto Attendants (virtual receptionists) and Call Queues (direct calls to the right team). Implement Teams Calling Plans or Operator Connect for business phone systems.',
    },
    {
      icon: Key,
      title: 'Single Sign-On (SSO) for External Apps',
      description: 'One login for Microsoft 365 and external services. Simplifies access for users and boosts security.',
    },
  ]

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={ref} className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6">
            Cloud Computing Solutions
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive cloud services to keep your business running securely and efficiently.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            const isOpen = openIndex === index

            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-brand-sky transition-all duration-300"
                style={{ boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)' }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-brand-sky/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand-sky" />
                    </div>
                    <h3 className="font-poppins text-base md:text-lg lg:text-xl font-bold text-black">
                      {solution.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 md:w-6 md:h-6 text-brand-sky transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-5 md:pb-6 pl-16 md:pl-20">
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Support Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="bg-brand-sky/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-brand-sky/20 inline-block">
            <h3 className="font-poppins text-lg md:text-xl font-bold text-black mb-3">
              IT Support & Maintenance
            </h3>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              Fast and friendly helpdesk support for your staff via Quick Assist or Remote Desktop Protocol
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-8 md:mt-12"
        >
          <a
            href="#contact"
            className="inline-block bg-brand-sky text-white font-semibold px-8 md:px-10 py-3 md:py-4 text-sm md:text-base rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
          >
            <span className="flex items-center gap-2">
              Get Started with Cloud Solutions
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
