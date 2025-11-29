'use client'

import { useState } from 'react'
import BenefitsEditor from './BenefitsEditor'
import TestimonialsEditor from './TestimonialsEditor'

export default function WhyChooseEditor() {
  const [activeTab, setActiveTab] = useState<'benefits' | 'testimonials'>('benefits')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why Choose Us Section</h2>
        <p className="text-gray-600">Manage the benefits and testimonials displayed in the "Why Choose" section.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'benefits'
              ? 'border-brand-sky text-brand-sky'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Benefits
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'testimonials'
              ? 'border-brand-sky text-brand-sky'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Testimonials
        </button>
      </div>

      {/* Content */}
      {activeTab === 'benefits' && <BenefitsEditor />}
      {activeTab === 'testimonials' && <TestimonialsEditor />}
    </div>
  )
}
