'use client'

import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, Trash2 } from 'lucide-react'
import { deleteAccount, signOut } from '@/lib/actions/auth'
import { getDateLocale } from '@/lib/date-locale'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function ProfileClient({
  userId,
  fullName,
  email,
  role,
  classroomCount,
  createdAt,
  avatarUrl,
  phone,
}: {
  userId: string
  fullName: string
  email: string | null
  role: 'teacher' | 'student'
  classroomCount: number
  createdAt: string
  avatarUrl?: string | null
  phone?: string | null
}) {
  const { t, i18n } = useTranslation()
  const locale = getDateLocale(i18n.language)
  const [phoneValue, setPhoneValue] = useState(phone ?? '')
  const [phoneSaving, setPhoneSaving] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [avatarRemoving, setAvatarRemoving] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [nameValue, setNameValue] = useState(fullName ?? '')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameMessage, setNameMessage] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(t('profile.delete_confirm'))) {
      e.preventDefault()
    }
  }

  const handlePhoneSave = async () => {
    setPhoneSaving(true)
    setPhoneMessage(null)
    setPhoneError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, phone: phoneValue || null }, { onConflict: 'id' })

    if (error) {
      setPhoneError(error.message || t('profile.phone_error'))
      setPhoneSaving(false)
      return
    }

    await supabase.auth.updateUser({ data: { phone: phoneValue || null } })
    setPhoneMessage(t('profile.phone_saved'))
    setPhoneSaving(false)
  }

  const handleNameSave = async () => {
    setNameSaving(true)
    setNameMessage(null)
    setNameError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: nameValue || null }, { onConflict: 'id' })

    if (error) {
      setNameError(error.message || t('profile.name_error'))
      setNameSaving(false)
      return
    }

    await supabase.auth.updateUser({ data: { full_name: nameValue || null } })
    setNameMessage(t('profile.name_saved'))
    setNameSaving(false)
  }

  const handleAvatarRemove = async () => {
    if (!confirm(t('profile.remove_avatar_confirm'))) return
    setAvatarRemoving(true)
    setAvatarMessage(null)
    setAvatarError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, avatar_url: null }, { onConflict: 'id' })

    if (error) {
      setAvatarError(error.message || t('profile.remove_avatar_error'))
      setAvatarRemoving(false)
      return
    }

    await supabase.auth.updateUser({ data: { avatar_url: null } })
    setAvatarMessage(t('profile.remove_avatar_success'))
    setAvatarRemoving(false)
  }

  return (
    <div className="p-6 sm:p-8 max-w-xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('profile.title')}</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {initials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="text-xl">{fullName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
              <Badge
                variant="secondary"
                className="mt-2 capitalize"
              >
                {role === 'teacher' ? t('roles.teacher') : t('roles.student')}
              </Badge>
              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild type="button" variant="outline" size="sm">
                    <Link href="/auth/avatar-setup?edit=1">{t('profile.edit_avatar')}</Link>
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleAvatarRemove}
                      disabled={avatarRemoving}
                    >
                      {avatarRemoving ? t('profile.remove_avatar_removing') : t('profile.remove_avatar')}
                    </Button>
                  )}
                </div>
                {avatarMessage && <p className="mt-2 text-xs text-emerald-600">{avatarMessage}</p>}
                {avatarError && <p className="mt-2 text-xs text-destructive">{avatarError}</p>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('profile.name_label')}</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder={t('profile.name_placeholder')}
                className="h-10"
              />
              <Button type="button" onClick={handleNameSave} disabled={nameSaving}>
                {nameSaving ? t('profile.name_saving') : t('profile.name_save')}
              </Button>
            </div>
            {nameMessage && <p className="mt-2 text-xs text-emerald-600">{nameMessage}</p>}
            {nameError && <p className="mt-2 text-xs text-destructive">{nameError}</p>}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('profile.phone_label')}</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                placeholder={t('profile.phone_placeholder')}
                className="h-10"
              />
              <Button type="button" onClick={handlePhoneSave} disabled={phoneSaving}>
                {phoneSaving ? t('profile.phone_saving') : t('profile.phone_save')}
              </Button>
            </div>
            {phoneMessage && <p className="mt-2 text-xs text-emerald-600">{phoneMessage}</p>}
            {phoneError && <p className="mt-2 text-xs text-destructive">{phoneError}</p>}
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">
                {role === 'teacher'
                  ? t('profile.classrooms_created')
                  : t('profile.classrooms_enrolled')}
              </dt>
              <dd className="mt-1 text-2xl font-bold text-foreground">{classroomCount}</dd>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">{t('profile.member_since')}</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {format(new Date(createdAt), 'dd MMM yyyy', { locale })}
              </dd>
            </div>
          </dl>

          <div className="border-t border-border pt-4">
            <form action={signOut}>
              <Button type="submit" variant="outline" className="gap-2 w-full sm:w-auto">
                <LogOut className="h-4 w-4" />
                {t('common.sign_out')}
              </Button>
            </form>
          </div>

          <div className="border-t border-border pt-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive">{t('profile.delete_title')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('profile.delete_description')}</p>
              <form action={deleteAccount} onSubmit={handleDelete} className="mt-3">
                <Button type="submit" variant="destructive" className="gap-2 w-full sm:w-auto">
                  <Trash2 className="h-4 w-4" />
                  {t('profile.delete_button')}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
