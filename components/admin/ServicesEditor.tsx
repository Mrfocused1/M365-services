'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X } from 'lucide-react'

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return

    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Service deleted!' })
      fetchServices()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSave(service: Partial<Service>) {
    setSaving(true)
    try {
      if (service.id) {
        const { error } = await supabase
          .from('services')
          .update({
            title: service.title,
            description: service.description,
            icon_name: service.icon_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', service.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Service updated!' })
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            title: service.title,
            description: service.description,
            icon_name: service.icon_name,
            is_active: true
          })
        if (error) throw error
        setMessage({ type: 'success', text: 'Service added!' })
      }
      setShowModal(false)
      setEditing(null)
      fetchServices()
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Microsoft 365 Setup & Optimisation</h2>
          <p className="text-gray-600">Manage the 3 service cards in the "Microsoft 365 Setup & Optimisation" section.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
          <Plus className="w-5 h-5" />Add Service
        </button>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <p className="text-gray-600 mb-4">No services added yet.</p>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
              Add Your First Service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg border p-4 md:p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(service); setShowModal(true) }} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Edit</button>
                  <button onClick={() => handleDelete(service.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <ServiceModal service={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null) }} saving={saving} />}
    </div>
  )
}

function ServiceModal({ service, onSave, onClose, saving }: { service: Service | null; onSave: (s: Partial<Service>) => void; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    title: service?.title || '',
    description: service?.description || '',
    icon_name: service?.icon_name || ''
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{service ? 'Edit' : 'Add'} Service</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="24/7 Threat Detection & Rapid Response" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 border rounded-lg" placeholder="Advanced monitoring and protection..." required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Icon Name (optional)</label>
            <input type="text" value={form.icon_name || ''} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Shield, Cloud, etc." />
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave({ ...service, ...form })} disabled={saving || !form.title || !form.description} className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />{service ? 'Update' : 'Add'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
