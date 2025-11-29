'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Benefit } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X } from 'lucide-react'
import ImageUpload from './ImageUpload'

export default function BenefitsEditor() {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Benefit | null>(null)

  useEffect(() => {
    fetchBenefits()
  }, [])

  async function fetchBenefits() {
    try {
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setBenefits(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase.from('benefits').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Deleted!' })
      fetchBenefits()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSave(benefit: Partial<Benefit>) {
    setSaving(true)
    try {
      if (benefit.id) {
        const { error } = await supabase
          .from('benefits')
          .update({ title: benefit.title, description: benefit.description, image_url: benefit.image_url, updated_at: new Date().toISOString() })
          .eq('id', benefit.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Updated!' })
      } else {
        const maxPos = benefits.length > 0 ? Math.max(...benefits.map(b => b.position)) : 0
        const { error } = await supabase
          .from('benefits')
          .insert({ title: benefit.title, description: benefit.description, image_url: benefit.image_url, position: maxPos + 1, is_active: true })
        if (error) throw error
        setMessage({ type: 'success', text: 'Added!' })
      }
      setShowModal(false)
      setEditing(null)
      fetchBenefits()
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
        <p className="text-gray-600">Manage the 4 benefit cards (Scalability, Secure, etc.)</p>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
          <Plus className="w-5 h-5" />Add Benefit
        </button>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="space-y-4">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="bg-white rounded-lg border p-4 md:p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-2">{benefit.description}</p>
                {benefit.image_url && <p className="text-sm text-gray-500">Image: <span className="font-mono text-brand-sky">{benefit.image_url}</span></p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(benefit); setShowModal(true) }} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Edit</button>
                <button onClick={() => handleDelete(benefit.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <BenefitModal benefit={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null) }} saving={saving} />}
    </div>
  )
}

function BenefitModal({ benefit, onSave, onClose, saving }: { benefit: Benefit | null; onSave: (b: Partial<Benefit>) => void; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ title: benefit?.title || '', description: benefit?.description || '', image_url: benefit?.image_url || '' })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{benefit ? 'Edit' : 'Add'} Benefit</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Scalability" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Pay only for what you need..." required />
          </div>
          <ImageUpload
            label="Benefit Image"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            accept="image/*"
          />
        </div>
        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave({ ...benefit, ...form })} disabled={saving || !form.title || !form.description} className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />{benefit ? 'Update' : 'Add'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
