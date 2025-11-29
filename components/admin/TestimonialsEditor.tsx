'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X } from 'lucide-react'

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Deleted!' })
      fetchTestimonials()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSave(testimonial: Partial<Testimonial>) {
    setSaving(true)
    try {
      if (testimonial.id) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            author_name: testimonial.author_name,
            author_role: testimonial.author_role,
            author_company: testimonial.author_company,
            text: testimonial.text,
            updated_at: new Date().toISOString()
          })
          .eq('id', testimonial.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Updated!' })
      } else {
        const maxPos = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.position)) : 0
        const { error } = await supabase
          .from('testimonials')
          .insert({
            author_name: testimonial.author_name,
            author_role: testimonial.author_role,
            author_company: testimonial.author_company,
            text: testimonial.text,
            position: maxPos + 1,
            is_active: true
          })
        if (error) throw error
        setMessage({ type: 'success', text: 'Added!' })
      }
      setShowModal(false)
      setEditing(null)
      fetchTestimonials()
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
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Manage customer testimonials</p>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
          <Plus className="w-5 h-5" />Add Testimonial
        </button>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg border p-4 md:p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                <div className="text-sm">
                  <p className="font-semibold">{testimonial.author_name}</p>
                  <p className="text-gray-600">{testimonial.author_role}, {testimonial.author_company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(testimonial); setShowModal(true) }} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Edit</button>
                <button onClick={() => handleDelete(testimonial.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <TestimonialModal testimonial={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null) }} saving={saving} />}
    </div>
  )
}

function TestimonialModal({ testimonial, onSave, onClose, saving }: { testimonial: Testimonial | null; onSave: (t: Partial<Testimonial>) => void; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    author_name: testimonial?.author_name || '',
    author_role: testimonial?.author_role || '',
    author_company: testimonial?.author_company || '',
    text: testimonial?.text || ''
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{testimonial ? 'Edit' : 'Add'} Testimonial</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Testimonial Text *</label>
            <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} className="w-full px-4 py-3 border rounded-lg" placeholder="M365 IT Services completely transformed..." required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Author Name *</label>
            <input type="text" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Sarah L." required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Author Role *</label>
            <input type="text" value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Operations Director" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <input type="text" value={form.author_company} onChange={(e) => setForm({ ...form, author_company: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="London Design Co." required />
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave({ ...testimonial, ...form })} disabled={saving || !form.text || !form.author_name || !form.author_role || !form.author_company} className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />{testimonial ? 'Update' : 'Add'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
