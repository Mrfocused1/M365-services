'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ContactInfo } from '@/lib/supabase'
import { Save, Loader2, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactInfoEditor() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  async function fetchContactInfo() {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single()

      if (error) throw error
      setContactInfo(data)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!contactInfo) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('contact_info')
        .update({
          phone_number: contactInfo.phone_number,
          email: contactInfo.email,
          address: contactInfo.address,
          business_hours: contactInfo.business_hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactInfo.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Contact information updated successfully!' })
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

  if (!contactInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">No contact information found. Please run the database setup SQL first.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">Update your business contact details.</p>
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
          <label htmlFor="phone_number" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            value={contactInfo.phone_number || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, phone_number: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="020 4582 5950"
          />
        </div>

        <div>
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={contactInfo.email || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="info@m365itservices.com"
          />
        </div>

        <div>
          <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            Business Address
          </label>
          <textarea
            id="address"
            value={contactInfo.address || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="123 Business Street, London, UK"
          />
        </div>

        <div>
          <label htmlFor="business_hours" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Business Hours
          </label>
          <input
            type="text"
            id="business_hours"
            value={contactInfo.business_hours || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, business_hours: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
            placeholder="Mon-Fri: 9AM-6PM"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: {new Date(contactInfo.updated_at).toLocaleString()}
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
        <div className="bg-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-center gap-2 text-lg font-medium">
            <Phone className="w-5 h-5" />
            {contactInfo.phone_number}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {contactInfo.email && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 mx-auto mb-2 text-brand-sky" />
              <p className="text-sm font-medium text-gray-900">{contactInfo.email}</p>
            </div>
          )}
          {contactInfo.address && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-brand-sky" />
              <p className="text-sm font-medium text-gray-900">{contactInfo.address}</p>
            </div>
          )}
          {contactInfo.business_hours && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-brand-sky" />
              <p className="text-sm font-medium text-gray-900">{contactInfo.business_hours}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
