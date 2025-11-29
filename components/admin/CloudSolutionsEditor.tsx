'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { CloudSolution } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, GripVertical, X } from 'lucide-react'

export default function CloudSolutionsEditor() {
  const [solutions, setSolutions] = useState<CloudSolution[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSolution, setEditingSolution] = useState<CloudSolution | null>(null)

  useEffect(() => {
    fetchSolutions()
  }, [])

  async function fetchSolutions() {
    try {
      const { data, error } = await supabase
        .from('cloud_solutions')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setSolutions(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this cloud solution?')) return

    try {
      const { error } = await supabase
        .from('cloud_solutions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Cloud solution deleted successfully!' })
      fetchSolutions()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSaveSolution(solution: Partial<CloudSolution>) {
    setSaving(true)
    setMessage(null)

    try {
      if (solution.id) {
        // Update existing solution
        const { error } = await supabase
          .from('cloud_solutions')
          .update({
            title: solution.title,
            description: solution.description,
            icon_name: solution.icon_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', solution.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Cloud solution updated successfully!' })
      } else {
        // Add new solution
        const maxPosition = solutions.length > 0 ? Math.max(...solutions.map(s => s.position)) : 0
        const { error } = await supabase
          .from('cloud_solutions')
          .insert({
            title: solution.title,
            description: solution.description,
            icon_name: solution.icon_name,
            position: maxPosition + 1,
            is_active: true
          })

        if (error) throw error
        setMessage({ type: 'success', text: 'Cloud solution added successfully!' })
      }

      setShowAddModal(false)
      setEditingSolution(null)
      fetchSolutions()
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

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Cloud Computing Solutions</h2>
          <p className="text-gray-600">Manage the cloud solutions displayed in the accordion section.</p>
        </div>
        <button
          onClick={() => {
            setEditingSolution(null)
            setShowAddModal(true)
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Solution
        </button>
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

      {/* Solutions List */}
      <div className="space-y-4">
        {solutions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No cloud solutions added yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors font-medium"
            >
              Add Your First Solution
            </button>
          </div>
        ) : (
          solutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <GripVertical className="w-5 h-5 text-gray-400 mt-1 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 break-words">{solution.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                        #{solution.position}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 break-words">{solution.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">Icon: <span className="font-mono text-brand-sky">{solution.icon_name}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditingSolution(solution)
                      setShowAddModal(true)
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(solution.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <SolutionModal
          solution={editingSolution}
          onSave={handleSaveSolution}
          onClose={() => {
            setShowAddModal(false)
            setEditingSolution(null)
          }}
          saving={saving}
        />
      )}
    </div>
  )
}

function SolutionModal({
  solution,
  onSave,
  onClose,
  saving
}: {
  solution: CloudSolution | null
  onSave: (solution: Partial<CloudSolution>) => void
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    title: solution?.title || '',
    description: solution?.description || '',
    icon_name: solution?.icon_name || 'Cloud'
  })

  const iconOptions = ['Cloud', 'Lock', 'Smartphone', 'Mail', 'Shield', 'Phone', 'Key', 'Server', 'Database']

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">
            {solution ? 'Edit Cloud Solution' : 'Add New Cloud Solution'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
              placeholder="Secure Backups & Disaster Recovery"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
              placeholder="Use Microsoft 365 Backup to keep business data safe. Quick recovery options in case of data loss or system failure."
              required
            />
          </div>

          <div>
            <label htmlFor="icon_name" className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <select
              id="icon_name"
              value={formData.icon_name}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...solution, ...formData })}
            disabled={saving || !formData.title || !formData.description}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {solution ? 'Update Solution' : 'Add Solution'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
