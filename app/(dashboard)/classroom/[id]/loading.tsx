export default function ClassroomLoading() {
    return (
        <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto animate-pulse space-y-4">
            {/* Announcement skeleton cards */}
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3.5 w-1/3 rounded bg-muted" />
                            <div className="h-2.5 w-1/5 rounded bg-muted" />
                        </div>
                    </div>
                    <div className="space-y-2 pt-1">
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-4/5 rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    )
}
