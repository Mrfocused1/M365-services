import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fhftuzgicesrsybkufxe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZnR1emdpY2VzcnN5Ymt1ZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODQyNTMsImV4cCI6MjA3OTg2MDI1M30.yFaeJRTI5lZkG2ADSMaQ3AKid88WW8J_XM1iTB-nHqU'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Initializing database...\n')

async function initDatabase() {
  try {
    // Insert default hero content
    console.log('📝 Inserting default hero content...')
    const { error: heroError } = await supabase
      .from('hero_content')
      .insert({
        headline: 'Professional IT Services & Microsoft 365 Solutions',
        subheadline: 'Transform your business with expert IT support, cloud migration, and comprehensive M365 implementation',
        video_url: '/video.mp4',
        cta_text: 'Get Started'
      })

    if (heroError && !heroError.message.includes('duplicate')) {
      console.error('❌ Hero content error:', heroError.message)
    } else {
      console.log('✅ Hero content inserted')
    }

    // Insert default navigation menu
    console.log('📝 Inserting navigation menu...')
    const navItems = [
      { label: 'Home', href: '#home', position: 1 },
      { label: 'Services', href: '#services', position: 2 },
      { label: 'About', href: '#about', position: 3 },
      { label: 'Contact', href: '#contact', position: 4 }
    ]

    for (const item of navItems) {
      const { error } = await supabase.from('navigation_menu').insert(item)
      if (error && !error.message.includes('duplicate')) {
        console.error(`❌ Nav item error (${item.label}):`, error.message)
      }
    }
    console.log('✅ Navigation menu inserted')

    // Insert default contact info
    console.log('📝 Inserting contact information...')
    const { error: contactError } = await supabase
      .from('contact_info')
      .insert({
        phone_number: '020 4582 5950',
        email: 'info@m365itservices.com',
        business_hours: 'Mon-Fri: 9AM-6PM'
      })

    if (contactError && !contactError.message.includes('duplicate')) {
      console.error('❌ Contact info error:', contactError.message)
    } else {
      console.log('✅ Contact information inserted')
    }

    // Insert default footer content
    console.log('📝 Inserting footer content...')
    const { error: footerError } = await supabase
      .from('footer_content')
      .insert({
        company_name: 'M365 IT Services',
        tagline: 'Your trusted partner for Microsoft 365 solutions and IT support',
        copyright_text: '© 2024 M365 IT Services. All rights reserved.'
      })

    if (footerError && !footerError.message.includes('duplicate')) {
      console.error('❌ Footer content error:', footerError.message)
    } else {
      console.log('✅ Footer content inserted')
    }

    console.log('\n✨ Database initialization complete!')
    console.log('🎯 You can now visit http://localhost:3000/admin to manage your content\n')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

initDatabase()
