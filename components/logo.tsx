import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  href?: string
  textColor?: string
}

export function Logo({ size = 48, showText = true, href = '/', textColor = '#1E3A8A' }: LogoProps) {
  return (
    <Link href={href} className="flex items-center gap-3 shrink-0">
      <Image
        src="/images/logo.png"
        alt="ShikkhaGriho Logo"
        width={size}
        height={size}
        className="object-contain drop-shadow-md"
        priority
      />
      {showText && (
        <span className="font-bold text-xl leading-tight tracking-tight" style={{ color: textColor }}>
          ShikkhaGriho
        </span>
      )}
    </Link>
  )
}
