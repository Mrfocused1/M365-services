'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteStat } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X, BarChart3 } from 'lucide-react'

export default function StatsEditor() {
  const [stats, setStats] = useState<SiteStat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<SiteStat | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setStats(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this stat?')) return
    try {
      const { error } = await supabase.from('site_stats').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Deleted!' })
      fetchStats()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSave(stat: Partial<SiteStat>) {
    setSaving(true)
    try {
      if (stat.id) {
        const { error } = await supabase
          .from('site_stats')
          .update({
            label: stat.label,
            value: stat.value,
            suffix: stat.suffix,
            decimals: stat.decimals,
            updated_at: new Date().toISOString()
          })
          .eq('id', stat.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Updated!' })
      } else {
        const maxPos = stats.length > 0 ? Math.max(...stats.map(s => s.position)) : 0
        const { error } = await supabase
          .from('site_stats')
          .insert({
            label: stat.label,
            value: stat.value,
            suffix: stat.suffix || '',
            decimals: stat.decimals || 0,
            position: maxPos + 1,
            is_active: true
          })
        if (error) throw error
        setMessage({ type: 'success', text: 'Added!' })
      }
      setShowModal(false)
      setEditing(null)
      fetchStats()
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Stats & Metrics</h2>
          <p className="text-gray-600">Manage the stats displayed on the homepage (150+ Happy Clients, 99.9% Uptime, etc.)</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90"
        >
          <Plus className="w-5 h-5" />Add Stat
        </button>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No stats added yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90"
            >
              Add Your First Stat
            </button>
          </div>
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg border p-6">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-brand-sky">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-gray-600">{stat.label}</p>
                {stat.decimals > 0 && (
                  <p className="text-xs text-gray-400 mt-1">({stat.decimals} decimal places)</p>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => { setEditing(stat); setShowModal(true) }}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stat.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <StatModal
          stat={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null) }}
          saving={saving}
        />
      )}
    </div>
  )
}

function StatModal({ stat, onSave, onClose, saving }: {
  stat: SiteStat | null
  onSave: (s: Partial<SiteStat>) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState({
    label: stat?.label || '',
    value: stat?.value || 0,
    suffix: stat?.suffix || '',
    decimals: stat?.decimals || 0
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{stat ? 'Edit' : 'Add'} Stat</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Label *</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Happy Clients"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Value *</label>
            <input
              type="number"
              step="0.1"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Suffix</label>
            <input
              type="text"
              value={form.suffix}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="+ or % or /7"
            />
            <p className="text-xs text-gray-500 mt-1">Examples: + (150+), % (99.9%), /7 (24/7)</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Decimal Places</label>
            <select
              value={form.decimals}
              onChange={(e) => setForm({ ...form, decimals: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value={0}>0 (whole numbers)</option>
              <option value={1}>1 (e.g., 99.9)</option>
              <option value={2}>2 (e.g., 99.99)</option>
            </select>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Preview:</p>
            <p className="text-2xl font-bold text-brand-sky">
              {form.decimals > 0 ? form.value.toFixed(form.decimals) : Math.round(form.value)}{form.suffix}
            </p>
            <p className="text-gray-600">{form.label}</p>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onSave({ ...stat, ...form })}
            disabled={saving || !form.label || form.value === undefined}
            className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {stat ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
