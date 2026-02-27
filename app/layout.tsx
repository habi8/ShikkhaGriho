import type { Metadata } from 'next'
import { Inter, Hind_Siliguri } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import './globals.css'
import { FloatingElements } from '@/components/landing/floating-elements'
import { I18nProvider } from '@/components/i18n-provider'

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
    apple: '/images/logo.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const language = cookieStore.get('sg_lang')?.value
  const lang = language === 'bn' || language === 'en' ? language : 'en'

  return (
    <html lang={lang}>
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased bg-transparent text-foreground relative`}>
        <I18nProvider initialLanguage={lang}>
          <FloatingElements />
          {children}
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  )
}
