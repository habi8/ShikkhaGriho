'use client'

import { useState, useTransition } from 'react'
import { submitReview } from '@/lib/actions/reviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, MessageSquareQuote, CheckCircle2 } from 'lucide-react'

// Define the shape of our review
export interface Review {
    id: string
    name: string
    review: string
    created_at: string
}

export function Reviews({ initialReviews }: { initialReviews: Review[] }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            try {
                await submitReview(formData)
                setSuccess(true)
                    // Reset form
                    ; (e.target as HTMLFormElement).reset()
            } catch (err: any) {
                setError(err.message || 'Something went wrong.')
            }
        })
    }

    return (
        <section id="reviews" className="relative py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl font-bold text-[#2E8B57] sm:text-4xl mb-4">What Our Visitors Say</h2>
                    <p className="text-base text-[#475569]">
                        Read reviews from our community or leave your own feedback.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left: Visitor Reviews List */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#0F172A] flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
                            <MessageSquareQuote className="h-6 w-6 text-[#2E8B57]" />
                            Recent Reviews
                        </h3>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                            {initialReviews.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-xl border border-[#E2E8F0]">
                                    <p className="text-[#475569]">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                initialReviews.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
                                        <p className="text-[#475569] leading-relaxed italic">"{item.review}"</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-8 w-8 bg-[#E2E8F0] rounded-full flex items-center justify-center font-bold text-[#2E8B57] text-sm shrink-0">
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="font-semibold text-[#0F172A]">{item.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Write a Review Form */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 h-fit sticky top-24">
                        <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Leave a Review</h3>
                        <p className="text-sm text-[#475569] mb-8">
                            Your feedback is valuable to us. Let us know how we can improve!
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-[#0F172A]">Your Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                    className="h-12 border-[#E2E8F0] focus-visible:ring-[#2E8B57]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review" className="text-sm font-semibold text-[#0F172A]">Your Review</Label>
                                <Textarea
                                    id="review"
                                    name="review"
                                    placeholder="Tell us what you think..."
                                    required
                                    rows={4}
                                    className="resize-none border-[#E2E8F0] focus-visible:ring-[#2E8B57]"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</p>
                            )}

                            {success && (
                                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <p>Thank you for submitting your review!</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white font-semibold text-base transition-colors"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}
