# M365 IT SERVICES Website

A modern, professional website for M365 IT SERVICES - a UK-based IT company specializing in Microsoft 365 cloud solutions for small and medium-sized businesses.

## Features

- **Modern Design**: Clean, corporate, and trustworthy design with smooth animations
- **Responsive**: Fully responsive across all devices (mobile, tablet, desktop)
- **Video Background**: Eye-catching hero section with video background
- **Contact Form**: Functional contact form with validation
- **Testimonial Carousel**: Auto-rotating customer testimonials
- **Smooth Animations**: Framer Motion animations throughout
- **SEO Optimized**: Meta tags and semantic HTML for search engines

## Tech Stack

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page
│   ├── about/
│   │   └── page.tsx      # About page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Navbar.tsx
│   ├── ContactBar.tsx
│   ├── HeroSection.tsx
│   ├── WhyChoose.tsx
│   ├── TestimonialCarousel.tsx
│   ├── AboutPreview.tsx
│   ├── Services.tsx
│   ├── AboutHero.tsx
│   ├── AboutContent.tsx
│   └── Footer.tsx
└── public/               # Static assets
```

## Customization

### Colors

The brand colors are defined in `tailwind.config.js`:
- Primary: Mauve (#A8729D)
- Secondary: Sky Blue (#5EA2D2)
- Background: Light Grey (#EBEAEA)

### Content

- Update contact information in `components/ContactBar.tsx` and `components/Footer.tsx`
- Modify testimonials in `components/TestimonialCarousel.tsx`
- Edit team members in `components/AboutContent.tsx`

## Deployment

This website can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any hosting service that supports Node.js

## Contact

For questions or support, contact:
- Phone: 020 4582 5950
- Email: info@m365itservices.co.uk
- Location: London, UK

## License

© 2025 M365 IT SERVICES. All rights reserved.
