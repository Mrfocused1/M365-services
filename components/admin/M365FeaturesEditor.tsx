'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { M365Feature } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, GripVertical, X } from 'lucide-react'
import ImageUpload from './ImageUpload'

export default function M365FeaturesEditor() {
  const [features, setFeatures] = useState<M365Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<M365Feature | null>(null)

  useEffect(() => {
    fetchFeatures()
  }, [])

  async function fetchFeatures() {
    try {
      const { data, error } = await supabase
        .from('m365_features')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setFeatures(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this feature?')) return

    try {
      const { error } = await supabase
        .from('m365_features')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Feature deleted successfully!' })
      fetchFeatures()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSaveFeature(feature: Partial<M365Feature>) {
    setSaving(true)
    setMessage(null)

    try {
      if (feature.id) {
        // Update existing feature
        const { error } = await supabase
          .from('m365_features')
          .update({
            title: feature.title,
            description: feature.description,
            icon_name: feature.icon_name,
            image_url: feature.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', feature.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Feature updated successfully!' })
      } else {
        // Add new feature
        const maxPosition = features.length > 0 ? Math.max(...features.map(f => f.position)) : 0
        const { error } = await supabase
          .from('m365_features')
          .insert({
            title: feature.title,
            description: feature.description,
            icon_name: feature.icon_name,
            image_url: feature.image_url,
            position: maxPosition + 1,
            is_active: true
          })

        if (error) throw error
        setMessage({ type: 'success', text: 'Feature added successfully!' })
      }

      setShowAddModal(false)
      setEditingFeature(null)
      fetchFeatures()
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">M365 Partner Features</h2>
          <p className="text-gray-600">Manage the 4 key features displayed in the "Your Perfect IT M365 Partner" section.</p>
        </div>
        <button
          onClick={() => {
            setEditingFeature(null)
            setShowAddModal(true)
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Feature
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

      {/* Features List */}
      <div className="space-y-4">
        {features.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No features added yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors font-medium"
            >
              Add Your First Feature
            </button>
          </div>
        ) : (
          features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <GripVertical className="w-5 h-5 text-gray-400 mt-1 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 break-words">{feature.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                        #{feature.position}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 break-words">{feature.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">Icon: <span className="font-mono text-brand-sky">{feature.icon_name}</span></span>
                      {feature.image_url && (
                        <span className="text-gray-500">Image: <span className="font-mono text-brand-sky">{feature.image_url}</span></span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditingFeature(feature)
                      setShowAddModal(true)
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feature.id)}
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
        <FeatureModal
          feature={editingFeature}
          onSave={handleSaveFeature}
          onClose={() => {
            setShowAddModal(false)
            setEditingFeature(null)
          }}
          saving={saving}
        />
      )}
    </div>
  )
}

function FeatureModal({
  feature,
  onSave,
  onClose,
  saving
}: {
  feature: M365Feature | null
  onSave: (feature: Partial<M365Feature>) => void
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    title: feature?.title || '',
    description: feature?.description || '',
    icon_name: feature?.icon_name || 'Cloud',
    image_url: feature?.image_url || ''
  })

  const iconOptions = ['Cloud', 'Shield', 'Headphones', 'Server', 'Lock', 'Users', 'Settings', 'Zap']

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">
            {feature ? 'Edit Feature' : 'Add New Feature'}
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
              placeholder="Seamless Migration"
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
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
              placeholder="Move emails, files, and data from your old systems to Microsoft 365..."
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

          <ImageUpload
            label="Feature Image"
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            accept="image/*"
          />
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
            onClick={() => onSave({ ...feature, ...formData })}
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
                {feature ? 'Update Feature' : 'Add Feature'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
