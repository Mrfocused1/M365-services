'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { NavigationMenuItem } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X, GripVertical } from 'lucide-react'

export default function NavigationEditor() {
  const [items, setItems] = useState<NavigationMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<NavigationMenuItem | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from('navigation_menu')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this menu item?')) return

    try {
      const { error } = await supabase.from('navigation_menu').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Menu item deleted!' })
      fetchItems()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSave(item: Partial<NavigationMenuItem>) {
    setSaving(true)
    try {
      if (item.id) {
        const { error } = await supabase
          .from('navigation_menu')
          .update({ label: item.label, href: item.href, updated_at: new Date().toISOString() })
          .eq('id', item.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Menu item updated!' })
      } else {
        const maxPos = items.length > 0 ? Math.max(...items.map(i => i.position)) : 0
        const { error } = await supabase
          .from('navigation_menu')
          .insert({ label: item.label, href: item.href, position: maxPos + 1, is_active: true })
        if (error) throw error
        setMessage({ type: 'success', text: 'Menu item added!' })
      }
      setShowModal(false)
      setEditing(null)
      fetchItems()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('navigation_menu')
        .update({ is_active: !currentState })
        .eq('id', id)
      if (error) throw error
      fetchItems()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-sky" /></div>

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Navigation Menu</h2>
          <p className="text-gray-600">Manage the main navigation menu items in the header.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
          <Plus className="w-5 h-5" />Add Menu Item
        </button>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-start gap-3 mb-3">
              <GripVertical className="w-5 h-5 text-gray-400 mt-1 hidden sm:block" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">#{item.position}</span>
                  <button
                    onClick={() => toggleActive(item.id, item.is_active)}
                    className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {item.is_active ? 'Active' : 'Hidden'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 break-all">→ {item.href}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(item); setShowModal(true) }} className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <MenuItemModal item={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null) }} saving={saving} />}
    </div>
  )
}

function MenuItemModal({ item, onSave, onClose, saving }: { item: NavigationMenuItem | null; onSave: (i: Partial<NavigationMenuItem>) => void; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ label: item?.label || '', href: item?.href || '' })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{item ? 'Edit' : 'Add'} Menu Item</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Label *</label>
            <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Home" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Link (href) *</label>
            <input type="text" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="#home or /about" required />
            <p className="text-xs text-gray-500 mt-1">Use # for anchor links (e.g., #services) or / for pages (e.g., /about)</p>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave({ ...item, ...form })} disabled={saving || !form.label || !form.href} className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />{item ? 'Update' : 'Add'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
