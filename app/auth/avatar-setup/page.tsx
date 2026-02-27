'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Cropper, { type Area } from 'react-easy-crop'
import { createClient } from '@/lib/supabase/client'
import { getCroppedImageBlob } from '@/lib/image-crop'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { Image as ImageIcon, Loader2 } from 'lucide-react'

const BUCKET_NAME = 'avatars'

export default function AvatarSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<'teacher' | 'student'>('student')

  const isEditMode = searchParams.get('edit') === '1'
  const returnTo = isEditMode ? '/profile' : null

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const userRole = (user.user_metadata?.role as 'teacher' | 'student') ?? 'student'
      setRole(userRole)
      setUserId(user.id)

      if (!isEditMode && user.user_metadata?.avatar_onboarded) {
        router.replace(userRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (!isEditMode && profile?.avatar_url) {
        router.replace(userRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard')
      }
    })
  }, [router, isEditMode])

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError(t('auth.avatar.error_invalid'))
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string)
    })
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels || !userId) {
      setError(t('auth.avatar.error_no_image'))
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels)
      const filePath = `${userId}/${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, blob, { upsert: true, contentType: 'image/jpeg' })

      if (uploadError) {
        setError(uploadError.message || t('auth.avatar.error_upload'))
        setIsSaving(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, avatar_url: publicUrl }, { onConflict: 'id' })
      if (profileError) {
        setError(profileError.message || t('auth.avatar.error_upload'))
        setIsSaving(false)
        return
      }
      const { error: userError } = await supabase.auth.updateUser({ data: { avatar_onboarded: true, avatar_url: publicUrl } })
      if (userError) {
        setError(userError.message || t('auth.avatar.error_upload'))
        setIsSaving(false)
        return
      }

      router.replace(returnTo ?? (role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'))
    } catch {
      setError(t('auth.avatar.error_upload'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = async () => {
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { avatar_onboarded: true } })
    router.replace(returnTo ?? (role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'))
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95">
          <CardHeader className="pb-3 pt-6 px-6">
            <CardTitle className="text-2xl font-extrabold text-foreground">{t('auth.avatar.title')}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {t('auth.avatar.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4">
              {imageSrc ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/90">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-xl bg-white text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4EA] text-[#2E8B57]">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('auth.avatar.upload_hint')}</p>
                    <p className="text-xs text-muted-foreground">{t('auth.avatar.square_hint')}</p>
                  </div>
                </div>
              )}
            </div>

            {imageSrc && (
              <label className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t('auth.avatar.zoom')}</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-2/3"
                />
              </label>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col gap-2">
              <Button type="button" className="w-full" onClick={() => fileRef.current?.click()}>
                {t('auth.avatar.choose')}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleSkip}>
                {t('auth.avatar.skip')}
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={handleSave}
                disabled={!imageSrc || isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('auth.avatar.saving')}
                  </span>
                ) : (
                  t('auth.avatar.save')
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
