import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/landing/hero'
import { CTA } from '@/components/landing/cta'
import { Reviews } from '@/components/landing/reviews'
import { Footer } from '@/components/landing/footer'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch reviews for the landing page
  const { data: reviews } = await supabase
    .from('visitor_reviews')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <CTA />
        <Reviews initialReviews={reviews ?? []} />
      </main>
      <Footer />
    </div>
  )
}
