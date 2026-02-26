'use client'

import { useTranslation } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'
import { ResourceUpload } from '@/components/classroom/resource-upload'
import { EmptyState } from '@/components/empty-state'
import { FileText, Download, Trash2, File, FileCode, FileImage, FileBarChart2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { deleteResourceByForm } from '@/lib/actions/resources'
import { getDateLocale } from '@/lib/date-locale'

export function ResourcesClient({
  classroomId,
  teacherId,
  isTeacher,
  resources,
}: {
  classroomId: string
  teacherId: string
  isTeacher: boolean
  resources: any[]
}) {
  const { t, i18n } = useTranslation()
  const supabase = createClient()
  const locale = getDateLocale(i18n.language)
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return t('resources.size.zero')
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = [
      t('resources.size.bytes'),
      t('resources.size.kb'),
      t('resources.size.mb'),
      t('resources.size.gb'),
    ]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-5 w-5 text-blue-500" />
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileBarChart2 className="h-5 w-5 text-green-500" />
    if (fileType.includes('wordprocessing') || fileType.includes('document')) return <FileText className="h-5 w-5 text-indigo-500" />
    if (fileType.includes('csv') || fileType.includes('zip') || fileType.includes('archive')) return <FileCode className="h-5 w-5 text-yellow-500" />
    return <File className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
      {isTeacher && <ResourceUpload classroomId={classroomId} teacherId={teacherId} />}

      <h2 className="text-xl font-bold text-foreground">{t('resources.title')}</h2>

      {resources?.length === 0 ? (
        <EmptyState
          title={t('resources.empty_title')}
          description={isTeacher ? t('resources.empty_teacher') : t('resources.empty_student')}
          icon={<FileText className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-3">
          {resources?.map((resource: any) => {
            const { data: { publicUrl } } = supabase.storage
              .from('resources')
              .getPublicUrl(resource.file_path)

            const downloadUrl = `${publicUrl}?download=${encodeURIComponent(resource.file_name)}`

            return (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-2.5 bg-muted/50 rounded-lg shrink-0">
                    {getFileIcon(resource.file_type)}
                  </div>
                  <div className="space-y-1 my-auto">
                    <p className="font-semibold text-sm text-foreground line-clamp-1 break-all" title={resource.file_name}>
                      {resource.file_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatBytes(Number(resource.file_size))}</span>
                      <span>•</span>
                      <span>{t('resources.uploaded', { time: formatDistanceToNow(new Date(resource.created_at), { addSuffix: true, locale }) })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <a href={downloadUrl} download={resource.file_name}>
                    <Button variant="secondary" size="sm" className="gap-2 shrink-0">
                      <Download className="h-4 w-4" />
                      {t('resources.download')}
                    </Button>
                  </a>

                  {isTeacher && (
                    <form action={deleteResourceByForm}>
                      <input type="hidden" name="resource_id" value={resource.id} />
                      <input type="hidden" name="file_path" value={resource.file_path} />
                      <input type="hidden" name="classroom_id" value={classroomId} />
                      <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
