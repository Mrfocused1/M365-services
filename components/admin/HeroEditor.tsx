'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { HeroContent } from '@/lib/supabase'
import { Save, Loader2 } from 'lucide-react'

export default function HeroEditor() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!heroContent) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('hero_content')
        .update({
          headline: heroContent.headline,
          subheadline: heroContent.subheadline,
          video_url: heroContent.video_url,
          cta_text: heroContent.cta_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', heroContent.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Hero section updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-sky" />
      </div>
    )
  }

  if (!heroContent) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">No hero content found. Please run the database setup SQL first.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hero Section Editor</h2>
        <p className="text-gray-600">Edit the main headline and subheadline on your homepage.</p>
      </div>

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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
            Headline
          </label>
          <input
            type="text"
            id="headline"
            value={heroContent.headline}
            onChange={(e) => setHeroContent({ ...heroContent, headline: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="Enter main headline"
          />
        </div>

        <div>
          <label htmlFor="subheadline" className="block text-sm font-medium text-gray-700 mb-2">
            Subheadline
          </label>
          <textarea
            id="subheadline"
            value={heroContent.subheadline}
            onChange={(e) => setHeroContent({ ...heroContent, subheadline: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="Enter subheadline"
          />
        </div>

        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
            Background Video URL
          </label>
          <input
            type="text"
            id="video_url"
            value={heroContent.video_url || ''}
            onChange={(e) => setHeroContent({ ...heroContent, video_url: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="/video.mp4"
          />
          <p className="mt-2 text-sm text-gray-600">Path to the background video file</p>
        </div>

        <div>
          <label htmlFor="cta_text" className="block text-sm font-medium text-gray-700 mb-2">
            Call-to-Action Button Text
          </label>
          <input
            type="text"
            id="cta_text"
            value={heroContent.cta_text}
            onChange={(e) => setHeroContent({ ...heroContent, cta_text: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="Get Started"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: {new Date(heroContent.updated_at).toLocaleString()}
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
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
      </div>

      {/* Preview */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="bg-gray-900 rounded-lg p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.headline}</h1>
          <p className="text-xl text-gray-300 mb-6">{heroContent.subheadline}</p>
          <button className="px-6 py-3 bg-brand-sky text-white rounded-lg font-medium">
            {heroContent.cta_text}
          </button>
        </div>
      </div>
    </div>
  )
}
