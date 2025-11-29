'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { HeroContent } from '@/lib/supabase'

export default function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showExtraFields, setShowExtraFields] = useState(false)

  useEffect(() => {
    fetchHeroContent()
  }, [])

  async function fetchHeroContent() {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single()

      if (error) throw error
      setHeroContent(data)
    } catch (error) {
      console.error('Error fetching hero content:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    // Only validate extra fields if they are visible
    if (showExtraFields) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Save to Supabase
        const { error: dbError } = await supabase
          .from('form_submissions')
          .insert({
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            is_read: false
          })

        if (dbError) throw dbError

        // Send email notification
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            message: formData.message,
          }),
        })

        if (!emailResponse.ok) {
          console.error('Email send failed, but form was saved to database')
        }

        setIsSubmitted(true)

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            message: '',
          })
          setShowExtraFields(false)
        }, 5000)
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('There was an error submitting your form. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  return (
    <section id="contact" className="relative min-h-screen pt-32 pb-0 overflow-hidden bg-gradient-to-br from-gray-50 to-white lg:bg-transparent">
      {/* Unified gradient overlay connecting both sides - Desktop only */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-gray-900/20 pointer-events-none z-10"></div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-8rem)] relative">
        {/* Mobile Only - Vertical Layout (Title → Video → Form) */}
        <div className="lg:hidden w-full flex flex-col items-center p-8 space-y-8 relative z-20">
          {/* Mobile Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center w-full max-w-xl"
          >
            <h1 className="font-poppins text-2xl md:text-3xl font-bold text-black leading-tight mb-3">
              {heroContent?.headline || 'Professional IT Services & Microsoft 365 Solutions'}
            </h1>
            <p className="text-base text-gray-600 font-normal">
              {heroContent?.subheadline || 'Transform your business with expert IT support, cloud migration, and comprehensive M365 implementation'}
            </p>
          </motion.div>

          {/* Mobile Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-auto block"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            >
              <source
                src="https://videos.pexels.com/video-files/34492301/14614661_1280_720_30fps.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Mobile Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-sm border border-white/60"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <h3 className="text-xl font-bold text-black mb-1">
                    Get In Touch
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    We'll get back to you within 48 hours.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all resize-none`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </motion.div>

                {!showExtraFields && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                    type="button"
                    onClick={() => setShowExtraFields(true)}
                    className="text-brand-sky text-xs font-medium hover:underline"
                  >
                    + Add company & phone details
                  </motion.button>
                )}

                {showExtraFields && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-brand-sky to-blue-600 text-white font-semibold py-3 text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && (
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.3 }}
                  className="text-[10px] text-center text-gray-500 mt-2">
                  We respect your privacy. Your information is secure with us.
                </motion.p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <h3 className="text-xl font-bold text-black mb-2">
                  Thank You!
                </h3>
                <p className="text-sm text-brand-grey">
                  We'll contact you shortly.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:block relative w-full lg:w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center p-8 lg:p-16 z-20">
          {/* Background Image - Desktop only */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/7414275/pexels-photo-7414275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Professional office background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/85"></div>
          </div>

          {/* Contact Form - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative z-30 bg-white/90 lg:bg-white/80 backdrop-blur-xl rounded-2xl p-5 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-sm border border-white/60 lg:border-white/40"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  <h3 className="text-xl font-bold text-black mb-1">
                    Get In Touch
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    We'll get back to you within 48 hours.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.55 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all resize-none`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </motion.div>

                {!showExtraFields && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.65 }}
                    type="button"
                    onClick={() => setShowExtraFields(true)}
                    className="text-brand-sky text-xs font-medium hover:underline"
                  >
                    + Add company & phone details
                  </motion.button>
                )}

                {showExtraFields && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } bg-white/50 text-black placeholder-gray-400 focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.75 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-sky to-blue-600 text-white font-semibold py-3 text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Message
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.85 }}
                  className="text-[10px] text-center text-gray-500 mt-2">
                  We respect your privacy. Your information is secure with us.
                </motion.p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <h3 className="text-xl font-bold text-black mb-2">
                  Thank You!
                </h3>
                <p className="text-sm text-brand-grey">
                  We'll contact you shortly.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Side - Title and Video - Desktop only */}
        <div className="hidden lg:flex relative w-full lg:w-1/2 flex-col items-center justify-start bg-gradient-to-br from-gray-50 to-white p-8 lg:p-16 lg:pt-8 min-h-[500px] lg:min-h-full">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8 z-20 relative"
          >
            <h1 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight mb-4">
              {heroContent?.headline || 'Professional IT Services & Microsoft 365 Solutions'}
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-normal max-w-2xl mx-auto">
              {heroContent?.subheadline || 'Transform your business with expert IT support, cloud migration, and comprehensive M365 implementation'}
            </p>
          </motion.div>

          {/* Video Below Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 relative"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            {/* Gradient overlay on video for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent z-10 pointer-events-none"></div>

            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-auto block"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            >
              <source
                src="https://videos.pexels.com/video-files/34492301/14614661_1280_720_30fps.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
