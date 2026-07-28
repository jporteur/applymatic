import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Applymatic — Apply smarter, not more',
  description:
    'AI finds matching jobs for tech workers, writes tailored cover letters, and submits applications. You approve — we handle the rest.',
  openGraph: {
    title: 'Applymatic — Apply smarter, not more',
    description:
      'AI finds matching jobs for tech workers, writes tailored cover letters, and submits applications. You approve — we handle the rest.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
