import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  href?: string
  textColor?: string
  logoBg?: boolean
  textSizeClass?: string
}

export function Logo({ size = 48, showText = true, href = '/', textColor = '#2E8B57', logoBg = false, textSizeClass = 'text-2xl sm:text-3xl' }: LogoProps) {
  const logoImage = (
    <Image
      src="/images/logo.png"
      alt="ShikkhaGriho Logo"
      width={size}
      height={size}
      className="object-contain drop-shadow-md"
      priority
    />
  )

  return (
    <Link href={href} className="flex items-center gap-3 shrink-0">
      {logoBg ? (
        <div className="rounded-xl bg-white p-2 shadow-md" style={{ border: '2px solid #E2E8F0' }}>
          {logoImage}
        </div>
      ) : (
        logoImage
      )}
      {showText && (
        <span className={`font-bold leading-tight tracking-tight ${textSizeClass}`} style={{ color: textColor }}>
          ShikkhaGriho
        </span>
      )}
    </Link>
  )
}
