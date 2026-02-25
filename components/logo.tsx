import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  href?: string
  textColor?: string
  logoBg?: boolean
}

export function Logo({ size = 48, showText = true, href = '/', textColor = '#1E3A8A', logoBg = false }: LogoProps) {
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
        <span className="font-bold text-xl leading-tight tracking-tight" style={{ color: textColor }}>
          ShikkhaGriho
        </span>
      )}
    </Link>
  )
}
