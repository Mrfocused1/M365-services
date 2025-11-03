'use client'

export default function ContactBar() {
  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-brand-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-3">
          <a
            href="tel:02045825950"
            className="text-white hover:text-gray-100 transition-colors font-medium"
          >
            <span className="text-lg">020 4582 5950</span>
          </a>
        </div>
      </div>
    </div>
  )
}
