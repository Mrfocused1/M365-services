'use client'

import { useState, useEffect } from 'react'
import BenefitsEditor from './BenefitsEditor'
import TestimonialsEditor from './TestimonialsEditor'
import { supabase } from '@/lib/supabase'
import { Save, Loader2 } from 'lucide-react'

export default function WhyChooseEditor() {
  const [activeTab, setActiveTab] = useState<'benefits' | 'testimonials' | 'settings'>('benefits')

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
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'settings'
              ? 'border-brand-sky text-brand-sky'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      {activeTab === 'benefits' && <BenefitsEditor />}
      {activeTab === 'testimonials' && <TestimonialsEditor />}
      {activeTab === 'settings' && <VisibilitySettings />}
    </div>
  )
}

function VisibilitySettings() {
  const [showTestimonials, setShowTestimonials] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('show_testimonials')
        .single()

      if (error) throw error
      if (data) {
        setShowTestimonials(data.show_testimonials ?? true)
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .single()

      if (existingSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            show_testimonials: showTestimonials,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id)

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-sky" />
      </div>
    )
  }

  return (
    <div>
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Visibility</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Show Testimonials Section</p>
              <p className="text-sm text-gray-600 mt-1">
                Display or hide the testimonials carousel on the homepage
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showTestimonials}
                onChange={(e) => setShowTestimonials(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-sky"></div>
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}
