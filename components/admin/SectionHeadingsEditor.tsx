'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Save, Loader2, Type } from 'lucide-react'

interface SectionHeading {
  id: string
  section_key: string
  title: string
  description: string | null
  badge_text: string | null
  cta_text: string | null
  cta_link: string | null
  updated_at: string
}

const sectionLabels: Record<string, string> = {
  services: 'Services Section',
  cloud_solutions: 'Cloud Solutions Section',
  cybersecurity: 'Cybersecurity Section',
  why_choose: 'Why Choose Us Section',
  testimonials: 'Testimonials Section',
  about_preview: 'About Preview (Homepage)',
  it_support: 'IT Support Notice',
}

export default function SectionHeadingsEditor() {
  const [sections, setSections] = useState<SectionHeading[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editedSections, setEditedSections] = useState<Record<string, Partial<SectionHeading>>>({})

  useEffect(() => {
    fetchSections()
  }, [])

  async function fetchSections() {
    try {
      const { data, error } = await supabase
        .from('section_headings')
        .select('*')
        .order('section_key')

      if (error) throw error
      setSections(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(sectionKey: string, field: string, value: string) {
    setEditedSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value
      }
    }))
  }

  function getFieldValue(section: SectionHeading, field: keyof SectionHeading): string {
    const edited = editedSections[section.section_key]
    if (edited && field in edited) {
      return (edited[field] as string) || ''
    }
    return (section[field] as string) || ''
  }

  async function handleSave(section: SectionHeading) {
    const edited = editedSections[section.section_key]
    if (!edited) return

    setSaving(section.section_key)
    try {
      const { error } = await supabase
        .from('section_headings')
        .update({
          title: edited.title ?? section.title,
          description: edited.description ?? section.description,
          badge_text: edited.badge_text ?? section.badge_text,
          cta_text: edited.cta_text ?? section.cta_text,
          cta_link: edited.cta_link ?? section.cta_link,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id)

      if (error) throw error

      setMessage({ type: 'success', text: `${sectionLabels[section.section_key] || section.section_key} updated!` })

      // Clear edited state for this section
      setEditedSections(prev => {
        const newState = { ...prev }
        delete newState[section.section_key]
        return newState
      })

      fetchSections()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(null)
    }
  }

  function hasChanges(sectionKey: string): boolean {
    return !!editedSections[sectionKey] && Object.keys(editedSections[sectionKey]).length > 0
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
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Section Headings</h2>
        <p className="text-gray-600">Edit titles, descriptions, and call-to-action buttons for each section of your website.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Type className="w-5 h-5 text-brand-sky" />
              <h3 className="font-semibold text-gray-900">
                {sectionLabels[section.section_key] || section.section_key}
              </h3>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-mono">
                {section.section_key}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={getFieldValue(section, 'title')}
                  onChange={(e) => handleChange(section.section_key, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
                  placeholder="Section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={getFieldValue(section, 'description')}
                  onChange={(e) => handleChange(section.section_key, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
                  placeholder="Section description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    value={getFieldValue(section, 'cta_text')}
                    onChange={(e) => handleChange(section.section_key, 'cta_text', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
                    placeholder="Get Started Today"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                  <input
                    type="text"
                    value={getFieldValue(section, 'cta_link')}
                    onChange={(e) => handleChange(section.section_key, 'cta_link', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
                    placeholder="/#contact"
                  />
                </div>
              </div>

              {hasChanges(section.section_key) && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleSave(section)}
                    disabled={saving === section.section_key}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50 transition-colors"
                  >
                    {saving === section.section_key ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
