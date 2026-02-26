'use client'

import { useMemo, useState, useTransition } from 'react'
import { submitReview } from '@/lib/actions/reviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Loader2, MessageSquareQuote, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
    const visibleReviews = useMemo(() => initialReviews.slice(0, 3), [initialReviews])
    const hasMoreThanThree = initialReviews.length > 3
    const { t } = useTranslation()

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
                const message = err?.message
                if (message === 'REVIEW_REQUIRED') {
                    setError(t('errors.review_required'))
                } else if (message === 'REVIEW_SUBMIT_FAILED') {
                    setError(t('errors.review_submit_failed'))
                } else {
                    setError(t('errors.generic'))
                }
            }
        })
    }

    return (
        <section id="reviews" className="relative py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 fade-in-up">
                    <h2 className="text-2xl font-bold text-[#2E8B57] sm:text-4xl mb-3 sm:mb-4">{t('landing.reviews.title')}</h2>
                    <p className="text-sm text-[#475569] sm:text-base">
                        {t('landing.reviews.subtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* Left: Visitor Reviews List */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#0F172A] flex items-center gap-3 border-b border-[#E2E8F0] pb-4 fade-in-up" style={{ ['--fade-delay' as any]: '80ms' }}>
                            <MessageSquareQuote className="h-6 w-6 text-[#2E8B57]" />
                            {t('landing.reviews.recent')}
                        </h3>

                        <div className="space-y-4">
                            {initialReviews.length === 0 ? (
                                    <div className="text-center py-10 bg-white rounded-xl border border-[#E2E8F0] fade-in-up" style={{ ['--fade-delay' as any]: '140ms' }}>
                                    <p className="text-[#475569]">{t('landing.reviews.empty')}</p>
                                </div>
                            ) : (
                                visibleReviews.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm fade-in-up"
                                        style={{ ['--fade-delay' as any]: `${120 + index * 80}ms` }}
                                    >
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
                        {hasMoreThanThree && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="mt-5 w-full border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/5"
                                    >
                                        {t('landing.reviews.show_all')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">{t('landing.reviews.all')}</DialogTitle>
                                    </DialogHeader>
                                    <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
                                        {initialReviews.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm fade-in-up"
                                                style={{ ['--fade-delay' as any]: `${80 + index * 60}ms` }}
                                            >
                                                <p className="text-[#475569] leading-relaxed italic">"{item.review}"</p>
                                                <div className="mt-4 flex items-center gap-3">
                                                    <div className="h-9 w-9 bg-[#F1F5F9] rounded-full border border-[#E2E8F0] flex items-center justify-center font-bold text-[#2E8B57] text-sm shrink-0">
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-semibold text-[#0F172A]">{item.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {/* Right: Write a Review Form */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-6 sm:p-8 lg:p-10 h-fit lg:sticky lg:top-24 fade-in-up" style={{ ['--fade-delay' as any]: '120ms' }}>
                        <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{t('landing.reviews.leave_title')}</h3>
                        <p className="text-sm text-[#475569] mb-8">
                            {t('landing.reviews.leave_subtitle')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-[#0F172A]">{t('landing.reviews.fields.name')}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={t('landing.reviews.placeholders.name')}
                                    required
                                    className="h-12 border-[#E2E8F0] focus-visible:ring-[#2E8B57]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review" className="text-sm font-semibold text-[#0F172A]">{t('landing.reviews.fields.review')}</Label>
                                <Textarea
                                    id="review"
                                    name="review"
                                    placeholder={t('landing.reviews.placeholders.review')}
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
                                    <p>{t('landing.reviews.success')}</p>
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
                                        {t('common.submitting')}
                                    </>
                                ) : (
                                    t('landing.reviews.submit')
                                )}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}
