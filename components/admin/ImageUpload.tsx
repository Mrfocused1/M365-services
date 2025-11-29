'use client'

import { useState } from 'react'
import { Upload, Link as LinkIcon, X } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
}

export default function ImageUpload({ value, onChange, label = "Image", accept = "image/*,video/*" }: ImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For now, we'll use a placeholder. In production, you'd upload to Supabase Storage
    // This is a temporary solution - shows how to handle file selection
    const reader = new FileReader()
    reader.onloadend = () => {
      // In a real app, upload to Supabase Storage and get the URL
      alert('File upload to Supabase Storage coming soon! For now, please use URL input.')
      console.log('File selected:', file.name)
      // onChange(uploadedUrl) // This would be the Supabase Storage URL
    }
    reader.readAsDataURL(file)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Current value display */}
      {value && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              {value.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                <img src={value} alt="Preview" className="w-20 h-20 object-cover rounded mb-2" />
              )}
              <p className="text-sm text-gray-600 font-mono truncate">{value}</p>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload options */}
      <div className="flex gap-2">
        {/* File Upload Button */}
        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-sky hover:bg-blue-50 cursor-pointer transition-colors">
          <Upload className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Upload File</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* URL Input Button */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-sky hover:bg-blue-50 transition-colors"
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
            placeholder="https://example.com/image.jpg or /local/path.jpg"
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
        Upload from device (coming soon) or enter a URL to an image/video
      </p>
    </div>
  )
}
