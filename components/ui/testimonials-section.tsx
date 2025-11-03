'use client'

import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-white text-black",
      "py-12 sm:py-16 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-6">
          <h2 className="max-w-[720px] text-3xl font-poppins font-bold leading-tight text-center sm:text-4xl md:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-base max-w-[600px] text-gray-600 text-center sm:text-lg">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
          <div className="flex gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <div className="flex shrink-0 gap-4 animate-marquee group-hover:[animation-play-state:paused]">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set1-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set1-dup-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
            <div className="flex shrink-0 gap-4 animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set2-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set2-dup-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
