import { Logo } from '@/components/logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Logo size={32} />
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} ShikkhaGriho. Built for Bangladesh.
        </p>
        <p className="text-xs text-muted-foreground">
          শিক্ষা গৃহ — A home for learning
        </p>
      </div>
    </footer>
  )
}
