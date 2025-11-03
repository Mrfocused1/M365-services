import Navbar from '@/components/Navbar'
import ContactBar from '@/components/ContactBar'
import AboutHero from '@/components/AboutHero'
import AboutContent from '@/components/AboutContent'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About Us — M365 IT SERVICES',
  description:
    'Learn about our team of Microsoft-certified professionals dedicated to empowering small and medium businesses.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactBar />
      <AboutHero />
      <AboutContent />
      <Footer />
    </main>
  )
}
