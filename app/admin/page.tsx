'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Home,
  Navigation,
  Briefcase,
  Shield,
  Cloud,
  Phone,
  FileText,
  Mail,
  Image,
  Settings,
  Menu,
  X,
  Users,
  Award,
  MessageSquare,
  Inbox,
  Info,
  BarChart3,
  Type
} from 'lucide-react'
import HeroEditor from '@/components/admin/HeroEditor'
import ContactInfoEditor from '@/components/admin/ContactInfoEditor'
import M365FeaturesEditor from '@/components/admin/M365FeaturesEditor'
import CloudSolutionsEditor from '@/components/admin/CloudSolutionsEditor'
import CybersecurityEditor from '@/components/admin/CybersecurityEditor'
import WhyChooseEditor from '@/components/admin/WhyChooseEditor'
import NavigationEditor from '@/components/admin/NavigationEditor'
import FooterEditor from '@/components/admin/FooterEditor'
import ServicesEditor from '@/components/admin/ServicesEditor'
import TeamEditor from '@/components/admin/TeamEditor'
import BenefitsEditor from '@/components/admin/BenefitsEditor'
import TestimonialsEditor from '@/components/admin/TestimonialsEditor'
import FormSubmissionsViewer from '@/components/admin/FormSubmissionsViewer'
import AboutEditor from '@/components/admin/AboutEditor'
import StatsEditor from '@/components/admin/StatsEditor'
import SectionHeadingsEditor from '@/components/admin/SectionHeadingsEditor'

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'navigation', label: 'Navigation Menu', icon: Navigation },
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'section-headings', label: 'Section Headings', icon: Type },
    { id: 'stats', label: 'Stats & Metrics', icon: BarChart3 },
    { id: 'why-choose', label: 'Why Choose Us', icon: FileText },
    { id: 'benefits', label: 'Benefits Cards', icon: Award },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'm365-features', label: 'M365 Partner Features', icon: Briefcase },
    { id: 'cloud-solutions', label: 'Cloud Solutions', icon: Cloud },
    { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield },
    { id: 'services', label: 'M365 Setup & Optimisation', icon: Settings },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'team', label: 'Meet the Team', icon: Users },
    { id: 'contact-info', label: 'Contact Information', icon: Phone },
    { id: 'footer', label: 'Footer', icon: Settings },
    { id: 'form-submissions', label: 'Form Submissions', icon: Inbox },
  ]

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden md:block text-sm text-gray-600">M365 IT Services</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 md:px-4 py-2 bg-brand-sky text-white rounded-lg hover:bg-brand-sky/90 transition-colors text-sm font-medium"
              >
                <span className="hidden sm:inline">View Website</span>
                <span className="sm:hidden">View</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          className={`
            fixed lg:static
            top-[73px] lg:top-0 left-0
            w-64 h-[calc(100vh-73px)] lg:h-auto
            bg-white border-r border-gray-200
            z-40 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-brand-sky text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:ml-0">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' && <DashboardOverview />}
            {activeSection === 'navigation' && <NavigationEditor />}
            {activeSection === 'hero' && <HeroEditor />}
            {activeSection === 'section-headings' && <SectionHeadingsEditor />}
            {activeSection === 'stats' && <StatsEditor />}
            {activeSection === 'why-choose' && <WhyChooseEditor />}
            {activeSection === 'benefits' && <BenefitsEditor />}
            {activeSection === 'testimonials' && <TestimonialsEditor />}
            {activeSection === 'm365-features' && <M365FeaturesEditor />}
            {activeSection === 'cloud-solutions' && <CloudSolutionsEditor />}
            {activeSection === 'cybersecurity' && <CybersecurityEditor />}
            {activeSection === 'services' && <ServicesEditor />}
            {activeSection === 'about' && <AboutEditor />}
            {activeSection === 'team' && <TeamEditor />}
            {activeSection === 'contact-info' && <ContactInfoEditor />}
            {activeSection === 'footer' && <FooterEditor />}
            {activeSection === 'form-submissions' && <FormSubmissionsViewer />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function DashboardOverview() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
      <p className="text-gray-600 mb-8">Manage all aspects of your M365 IT Services website from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-brand-sky" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hero Section</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Cloud className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cloud Solutions</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Services</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Form Submissions</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-sky hover:bg-blue-50 transition-colors text-left">
            <Home className="w-6 h-6 text-brand-sky mb-2" />
            <p className="font-medium text-gray-900">Edit Hero Section</p>
            <p className="text-sm text-gray-600">Update homepage headline and video</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-sky hover:bg-blue-50 transition-colors text-left">
            <Cloud className="w-6 h-6 text-brand-sky mb-2" />
            <p className="font-medium text-gray-900">Manage Cloud Solutions</p>
            <p className="text-sm text-gray-600">Add or edit cloud service offerings</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-sky hover:bg-blue-50 transition-colors text-left">
            <Phone className="w-6 h-6 text-brand-sky mb-2" />
            <p className="font-medium text-gray-900">Update Contact Info</p>
            <p className="text-sm text-gray-600">Change phone, email, or address</p>
          </button>
        </div>
      </div>
    </div>
  )
}
