'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
    const name = formData.get('name') as string
    const review = formData.get('review') as string

    if (!name || !review) {
        throw new Error('REVIEW_REQUIRED')
    }

    // We can insert without auth token because RLS permits INSERT anonymously
    const supabase = await createClient()

    const { error } = await supabase.from('visitor_reviews').insert({
        name: name.trim(),
        review: review.trim(),
    })

    if (error) {
        console.error("Supabase insert error:", error)
        throw new Error('REVIEW_SUBMIT_FAILED')
    }

    revalidatePath('/')
}
