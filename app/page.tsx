import Navbar from '@/components/Navbar'
import ContactBar from '@/components/ContactBar'
import HeroSection from '@/components/HeroSection'
import WhyChoose from '@/components/WhyChoose'
import AboutPreview from '@/components/AboutPreview'
import CloudSolutions from '@/components/CloudSolutions'
import Services from '@/components/Services'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactBar />
      <HeroSection />
      <WhyChoose />
      <AboutPreview />
      <CloudSolutions />
      <Services />
      <Footer />
    </main>
  )
}
