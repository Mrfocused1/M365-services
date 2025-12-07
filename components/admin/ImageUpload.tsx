'use client'

import { useState } from 'react'
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
}

export default function ImageUpload({ value, onChange, label = "Image", accept = "image/*,video/*" }: ImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setError('Please upload an image or video file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
      // Reset the input so the same file can be selected again
      e.target.value = ''
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
      setError(null)
    }
  }

  const handleRemove = async () => {
    // If the URL is from our Supabase storage, try to delete it
    if (value.includes('supabase.co/storage')) {
      try {
        const path = value.split('/media/')[1]
        if (path) {
          await supabase.storage.from('media').remove([path])
        }
      } catch (err) {
        console.error('Failed to delete file from storage:', err)
      }
    }
    onChange('')
  }

  const isVideo = value && (value.match(/\.(mp4|webm|mov|avi)$/i) || value.includes('video'))

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Current value display */}
      {value && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {isVideo ? (
                <div className="relative w-32 h-24 bg-gray-900 rounded mb-2 flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                  <video src={value} className="absolute inset-0 w-full h-full object-cover rounded opacity-50" muted />
                </div>
              ) : value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || value.includes('supabase.co/storage') ? (
                <img
                  src={value}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-600 font-mono truncate max-w-xs">{value}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
              title="Remove"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload options */}
      <div className="flex gap-2">
        {/* File Upload Button */}
        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          uploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-brand-sky hover:bg-blue-50'
        }`}>
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 text-brand-sky animate-spin" />
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Upload from Device</span>
            </>
          )}
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* URL Input Button */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-sky hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LinkIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Enter URL</span>
        </button>
      </div>

      {/* URL Input Field */}
      {showUrlInput && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-sky focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90"
          >
            Add
          </button>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Upload images or videos (max 10MB) or enter a URL
      </p>
    </div>
  )
}
