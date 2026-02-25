import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  href?: string
}

export function Logo({ size = 40, showText = true, href = '/' }: LogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0">
      <Image
        src="/images/logo.png"
        alt="ShikkhaGriho Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {showText && (
        <span className="font-bold text-lg leading-tight text-foreground">
          ShikkhaGriho
        </span>
      )}
    </Link>
  )
}
