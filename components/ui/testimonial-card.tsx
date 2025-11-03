'use client'

import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  role: string
  company: string
  image?: string
}

interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const CardWrapper = href ? 'a' : 'div'

  return (
    <CardWrapper
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className={cn(
        "relative flex w-[350px] flex-col gap-4 rounded-2xl p-6",
        "bg-white/80 backdrop-blur-xl border border-white/40",
        "transition-all duration-300 hover:-translate-y-1",
        href && "cursor-pointer hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
        className
      )}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      <p className="text-base text-black leading-relaxed italic">
        "{text}"
      </p>

      <div className="flex items-center gap-3 mt-2">
        {author.image && (
          <img
            src={author.image}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col">
          <p className="font-poppins font-semibold text-black text-sm">
            {author.name}
          </p>
          <p className="text-gray-600 text-xs">
            {author.role}, {author.company}
          </p>
        </div>
      </div>
    </CardWrapper>
  )
}
