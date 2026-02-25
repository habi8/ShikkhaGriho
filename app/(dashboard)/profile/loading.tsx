import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProfileLoading() {
    return (
        <div className="p-6 sm:p-8 max-w-xl mx-auto animate-pulse">
            <div className="h-8 w-1/4 rounded bg-muted mb-6" />

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-muted" />
                        <div className="space-y-2 flex-1">
                            <div className="h-6 w-1/2 rounded bg-muted" />
                            <div className="h-4 w-1/3 rounded bg-muted" />
                            <div className="h-5 w-16 rounded-full bg-muted mt-2" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                            <div className="h-3 w-1/2 rounded bg-muted" />
                            <div className="h-8 w-1/4 rounded bg-muted" />
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                            <div className="h-3 w-1/2 rounded bg-muted" />
                            <div className="h-5 w-2/3 rounded bg-muted mt-2" />
                        </div>
                    </div>
                    <div className="border-t border-border pt-4">
                        <div className="h-10 w-32 rounded bg-muted" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
