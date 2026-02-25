export default function DashboardLoading() {
    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8 rounded-2xl px-7 py-6 bg-muted/50 h-32" />

            {/* Cards grid skeleton */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                        <div className="h-3 w-1/3 rounded bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    )
}
