'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { FormSubmission } from '@/lib/supabase'
import { Loader2, Mail, Phone, Calendar, Trash2, Eye, CheckCircle2 } from 'lucide-react'

export default function FormSubmissionsViewer() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  async function fetchSubmissions() {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(id: string, isRead: boolean) {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ is_read: !isRead })
        .eq('id', id)

      if (error) throw error

      setMessage({
        type: 'success',
        text: isRead ? 'Marked as unread!' : 'Marked as read!'
      })
      fetchSubmissions()
      setTimeout(() => setMessage(null), 2000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Submission deleted successfully!' })
      fetchSubmissions()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-sky" />
      </div>
    )
  }

  const unreadCount = submissions.filter(s => !s.is_read).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Form Submissions</h2>
        <p className="text-gray-600">
          View and manage contact form submissions.
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-sky text-white">
              {unreadCount} unread
            </span>
          )}
        </p>
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

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No form submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className={`bg-white rounded-lg border p-4 md:p-6 transition-all ${
                submission.is_read
                  ? 'border-gray-200'
                  : 'border-brand-sky bg-blue-50/30'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {submission.full_name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${submission.email}`} className="hover:text-brand-sky">
                            {submission.email}
                          </a>
                        </span>
                        {submission.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${submission.phone}`} className="hover:text-brand-sky">
                              {submission.phone}
                            </a>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(submission.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {!submission.is_read && (
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-sky whitespace-nowrap">
                        <Eye className="w-4 h-4" />
                        Unread
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                    <p className="text-gray-800 whitespace-pre-wrap break-words">{submission.message}</p>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                  <button
                    onClick={() => handleMarkAsRead(submission.id, submission.is_read)}
                    className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {submission.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="flex-1 lg:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
