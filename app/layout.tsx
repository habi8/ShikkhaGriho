import type { Metadata } from 'next'
import { Inter, Hind_Siliguri } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { FloatingElements } from '@/components/landing/floating-elements'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})
const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'ShikkhaGriho — শিক্ষা গৃহ',
  description: 'A modern classroom management platform for Bangladeshi teachers and students.',
  generator: 'v0.app',
  icons: {
    icon: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased bg-transparent text-foreground relative`}>
        <FloatingElements />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
