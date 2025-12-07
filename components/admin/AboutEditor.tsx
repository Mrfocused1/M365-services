'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { AboutContent, AboutValue } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X, FileText } from 'lucide-react'

export default function AboutEditor() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [values, setValues] = useState<AboutValue[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showValueModal, setShowValueModal] = useState(false)
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch about content
      const { data: contentData, error: contentError } = await supabase
        .from('about_content')
        .select('*')
        .single()

      if (contentError && contentError.code !== 'PGRST116') throw contentError
      if (contentData) setContent(contentData)

      // Fetch values
      const { data: valuesData, error: valuesError } = await supabase
        .from('about_values')
        .select('*')
        .order('position', { ascending: true })

      if (valuesError) throw valuesError
      setValues(valuesData || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveContent() {
    if (!content) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert({
          ...content,
          updated_at: new Date().toISOString()
        })
      if (error) throw error
      setMessage({ type: 'success', text: 'About content saved!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteValue(id: string) {
    if (!confirm('Delete this value card?')) return
    try {
      const { error } = await supabase.from('about_values').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Deleted!' })
      fetchData()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSaveValue(value: Partial<AboutValue>) {
    setSaving(true)
    try {
      if (value.id) {
        const { error } = await supabase
          .from('about_values')
          .update({
            title: value.title,
            description: value.description,
            icon_name: value.icon_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', value.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Updated!' })
      } else {
        const maxPos = values.length > 0 ? Math.max(...values.map(v => v.position)) : 0
        const { error } = await supabase
          .from('about_values')
          .insert({
            title: value.title,
            description: value.description,
            icon_name: value.icon_name,
            position: maxPos + 1,
            is_active: true
          })
        if (error) throw error
        setMessage({ type: 'success', text: 'Added!' })
      }
      setShowValueModal(false)
      setEditingValue(null)
      fetchData()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-sky" /></div>

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">About Page Content</h2>
        <p className="text-gray-600">Manage the About page hero, text content, and value cards.</p>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      {/* Hero Content Section */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">About Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title</label>
            <input
              type="text"
              value={content?.hero_title || ''}
              onChange={(e) => setContent(prev => prev ? { ...prev, hero_title: e.target.value } : null)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky"
              placeholder="Your Perfect IT M365 Partner"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <textarea
              value={content?.hero_subtitle || ''}
              onChange={(e) => setContent(prev => prev ? { ...prev, hero_subtitle: e.target.value } : null)}
              rows={2}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky"
              placeholder="I help small and medium-sized businesses..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Description</label>
            <textarea
              value={content?.hero_description || ''}
              onChange={(e) => setContent(prev => prev ? { ...prev, hero_description: e.target.value } : null)}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky"
              placeholder="From moving your emails and files..."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Call to Action Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">CTA Title</label>
            <input
              type="text"
              value={content?.cta_title || ''}
              onChange={(e) => setContent(prev => prev ? { ...prev, cta_title: e.target.value } : null)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky"
              placeholder="Ready to Transform Your Business?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Subtitle</label>
            <textarea
              value={content?.cta_subtitle || ''}
              onChange={(e) => setContent(prev => prev ? { ...prev, cta_subtitle: e.target.value } : null)}
              rows={2}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky"
              placeholder="Let's discuss how our M365 solutions..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Button Text</label>
            <input
              type="text"
              value={content?.cta_button_text || ''}
              onChange={(e) => setContent(prev => prev ? { ...prev, cta_button_text: e.target.value } : null)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky"
              placeholder="Get Started Today"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSaveContent}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Content
          </button>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Value Cards (Client-Focused, Security First, etc.)</h3>
          <button
            onClick={() => { setEditingValue(null); setShowValueModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90"
          >
            <Plus className="w-5 h-5" />Add Value
          </button>
        </div>
        <div className="space-y-3">
          {values.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No value cards yet. Add your first one!</p>
            </div>
          ) : (
            values.map((value) => (
              <div key={value.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{value.title}</p>
                  <p className="text-sm text-gray-600">{value.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Icon: {value.icon_name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingValue(value); setShowValueModal(true) }}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteValue(value.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showValueModal && (
        <ValueModal
          value={editingValue}
          onSave={handleSaveValue}
          onClose={() => { setShowValueModal(false); setEditingValue(null) }}
          saving={saving}
        />
      )}
    </div>
  )
}

function ValueModal({ value, onSave, onClose, saving }: {
  value: AboutValue | null
  onSave: (v: Partial<AboutValue>) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState({
    title: value?.title || '',
    description: value?.description || '',
    icon_name: value?.icon_name || 'Users'
  })

  const iconOptions = ['Users', 'Shield', 'Cloud', 'HeartHandshake', 'Headphones', 'Lock', 'Server', 'Settings', 'Zap']

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{value ? 'Edit' : 'Add'} Value Card</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Client-Focused"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Your success is our priority..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <select
              value={form.icon_name}
              onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onSave({ ...value, ...form })}
            disabled={saving || !form.title || !form.description}
            className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {value ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
