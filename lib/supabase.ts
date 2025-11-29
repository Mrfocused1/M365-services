import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export type HeroContent = {
  id: string
  headline: string
  subheadline: string
  video_url: string | null
  cta_text: string
  updated_at: string
}

export type NavigationMenuItem = {
  id: string
  label: string
  href: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type M365Feature = {
  id: string
  title: string
  description: string
  icon_name: string
  image_url: string | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CloudSolution = {
  id: string
  title: string
  description: string
  icon_name: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CybersecurityService = {
  id: string
  title: string
  description: string
  icon_name: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type WhyChooseFeature = {
  id: string
  number: string
  title: string
  description: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Service = {
  id: string
  title: string
  description: string
  icon_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ContactInfo = {
  id: string
  phone_number: string | null
  email: string | null
  address: string | null
  business_hours: string | null
  updated_at: string
}

export type FooterContent = {
  id: string
  company_name: string | null
  tagline: string | null
  copyright_text: string | null
  updated_at: string
}

export type FooterLink = {
  id: string
  section: string
  label: string
  href: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SocialLink = {
  id: string
  platform: string
  url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FormSubmission = {
  id: string
  full_name: string
  email: string
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}

export type MediaItem = {
  id: string
  file_name: string
  file_url: string
  file_type: string
  alt_text: string | null
  used_in: string[] | null
  uploaded_at: string
}

export type Benefit = {
  id: string
  title: string
  description: string
  image_url: string | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Testimonial = {
  id: string
  author_name: string
  author_role: string
  author_company: string
  text: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}
