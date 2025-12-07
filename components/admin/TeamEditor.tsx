'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/supabase'
import { Save, Loader2, Plus, Trash2, X, Users, Upload, Eye, EyeOff } from 'lucide-react'

export default function TeamEditor() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [sectionVisible, setSectionVisible] = useState(true)
  const [togglingVisibility, setTogglingVisibility] = useState(false)

  useEffect(() => {
    fetchMembers()
    fetchSectionVisibility()
  }, [])

  async function fetchSectionVisibility() {
    try {
      const { data, error } = await supabase
        .from('section_settings')
        .select('*')
        .eq('section_key', 'team')
        .single()

      if (!error && data) {
        setSectionVisible(data.is_visible)
      }
    } catch (error) {
      // If no record exists, default to visible
      setSectionVisible(true)
    }
  }

  async function toggleSectionVisibility() {
    setTogglingVisibility(true)
    try {
      const newVisibility = !sectionVisible

      // Try to update existing record first
      const { data: existing } = await supabase
        .from('section_settings')
        .select('id')
        .eq('section_key', 'team')
        .single()

      if (existing) {
        const { error } = await supabase
          .from('section_settings')
          .update({ is_visible: newVisibility, updated_at: new Date().toISOString() })
          .eq('section_key', 'team')
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('section_settings')
          .insert({ section_key: 'team', is_visible: newVisibility })
        if (error) throw error
      }

      setSectionVisible(newVisibility)
      setMessage({ type: 'success', text: `Team section is now ${newVisibility ? 'visible' : 'hidden'}` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setTogglingVisibility(false)
    }
  }

  async function fetchMembers() {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this team member?')) return

    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Team member deleted!' })
      fetchMembers()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleSave(member: Partial<TeamMember>) {
    setSaving(true)
    try {
      if (member.id) {
        const { error } = await supabase
          .from('team_members')
          .update({
            name: member.name,
            title: member.title,
            bio: member.bio,
            image_url: member.image_url,
            position: member.position,
            updated_at: new Date().toISOString()
          })
          .eq('id', member.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Team member updated!' })
      } else {
        const newPosition = members.length > 0 ? Math.max(...members.map(m => m.position)) + 1 : 1
        const { error } = await supabase
          .from('team_members')
          .insert({
            name: member.name,
            title: member.title,
            bio: member.bio,
            image_url: member.image_url,
            position: newPosition,
            is_active: true
          })
        if (error) throw error
        setMessage({ type: 'success', text: 'Team member added!' })
      }
      setShowModal(false)
      setEditing(null)
      fetchMembers()
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Meet the Team</h2>
          <p className="text-gray-600">Manage your team members displayed on the About page.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={toggleSectionVisibility}
            disabled={togglingVisibility}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              sectionVisible
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {togglingVisibility ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : sectionVisible ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
            {sectionVisible ? 'Visible' : 'Hidden'}
          </button>
          <button onClick={() => { setEditing(null); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
            <Plus className="w-5 h-5" />Add Team Member
          </button>
        </div>
      </div>

      {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No team members added yet.</p>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90">
              Add Your First Team Member
            </button>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">{member.name}</h3>
                  <p className="text-brand-sky text-sm font-medium">{member.title}</p>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">{member.bio}</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 pt-0 justify-end">
                <button onClick={() => { setEditing(member); setShowModal(true) }} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">Edit</button>
                <button onClick={() => handleDelete(member.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <TeamMemberModal member={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null) }} saving={saving} />}
    </div>
  )
}

function TeamMemberModal({ member, onSave, onClose, saving }: { member: TeamMember | null; onSave: (m: Partial<TeamMember>) => void; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    title: member?.title || '',
    bio: member?.bio || '',
    image_url: member?.image_url || '',
    position: member?.position || 1
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold">{member ? 'Edit' : 'Add'} Team Member</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent" placeholder="John Smith" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent" placeholder="Lead Solutions Architect" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bio *</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent" placeholder="Microsoft Certified Expert with 10+ years in cloud infrastructure..." required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input type="text" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent" placeholder="/team1.jpeg or https://..." />
            <p className="text-xs text-gray-500 mt-1">Enter an image URL or path (e.g., /team1.jpeg)</p>
          </div>
          {form.image_url && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview</label>
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t flex gap-3 justify-end sticky bottom-0 bg-white">
          <button onClick={onClose} disabled={saving} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave({ ...member, ...form })} disabled={saving || !form.name || !form.title || !form.bio} className="flex items-center gap-2 px-6 py-3 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 disabled:opacity-50">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />{member ? 'Update' : 'Add'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
