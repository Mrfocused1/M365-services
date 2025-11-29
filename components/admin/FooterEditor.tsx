'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { FooterContent, FooterLink, SocialLink } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X } from 'lucide-react'

export default function FooterEditor() {
  const [activeTab, setActiveTab] = useState<'content' | 'links'>('content')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Footer</h2>
        <p className="text-gray-600">Manage footer content and links.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['content', 'links'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 font-medium capitalize border-b-2 ${
              activeTab === tab ? 'border-brand-sky text-brand-sky' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'content' && <FooterContentEditor />}
      {activeTab === 'links' && <FooterLinksEditor />}
    </div>
  )
}

function FooterContentEditor() {
  const [content, setContent] = useState<FooterContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    try {
      const { data, error } = await supabase.from('footer_content').select('*').single()
      if (error) throw error
      setContent(data)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!content) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('footer_content')
        .update({
          company_name: content.company_name,
          tagline: content.tagline,
          copyright_text: content.copyright_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', content.id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Footer content updated!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-brand-sky mx-auto" />

  return (
    <div>
      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            value={content?.company_name || ''}
            onChange={(e) => setContent({ ...content!, company_name: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="M365 IT Services"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <input
            type="text"
            value={content?.tagline || ''}
            onChange={(e) => setContent({ ...content!, tagline: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Your trusted partner for Microsoft 365 solutions"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Copyright Text</label>
          <input
            type="text"
            value={content?.copyright_text || ''}
            onChange={(e) => setContent({ ...content!, copyright_text: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="© 2024 M365 IT Services. All rights reserved."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50"
        >
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />Save Changes</>}
        </button>
      </div>
    </div>
  )
}

function FooterLinksEditor() {
  const [links, setLinks] = useState<FooterLink[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    try {
      const { data, error } = await supabase.from('footer_links').select('*').order('section').order('position')
      if (error) throw error
      setLinks(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this link?')) return
    try {
      const { error } = await supabase.from('footer_links').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Link deleted!' })
      fetchLinks()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const sections = ['company', 'services', 'support', 'legal']

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-brand-sky mx-auto" />

  return (
    <div>
      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map(section => (
          <div key={section} className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold capitalize mb-3">{section}</h3>
            <div className="space-y-2">
              {links.filter(l => l.section === section).map(link => (
                <div key={link.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-gray-500">{link.href}</p>
                  </div>
                  <button onClick={() => handleDelete(link.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">Footer links editor - Add functionality can be extended as needed</p>
    </div>
  )
}

function SocialLinksEditor() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    try {
      const { data, error } = await supabase.from('social_links').select('*')
      if (error) throw error
      setLinks(data || [])
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-brand-sky mx-auto" />

  return (
    <div className="bg-white rounded-lg border p-6">
      <p className="text-gray-600">Social media links editor - Coming soon</p>
      <div className="mt-4 space-y-2">
        {links.map(link => (
          <div key={link.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium capitalize">{link.platform}</p>
              <p className="text-sm text-gray-600">{link.url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
