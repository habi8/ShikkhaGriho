'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createResourceRecord } from '@/lib/actions/resources'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ResourceUpload({ classroomId, teacherId }: { classroomId: string, teacherId: string }) {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setError(null)
        const supabase = createClient()

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const randomName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
            const filePath = `${classroomId}/${teacherId}/${randomName}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('resources')
                .upload(filePath, file, { cacheControl: '3600', upsert: false })

            if (uploadError) throw new Error(uploadError.message)

            // 2. Insert metadata into Database
            await createResourceRecord(classroomId, file.name, filePath, file.type, file.size)

            setFile(null)

        } catch {
            setError(t('errors.upload_failed'))
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* File Select */}
                <div className="relative flex-1 w-full sm:w-auto h-auto min-h-24 sm:min-h-0 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/50 transition-colors bg-card cursor-pointer flex flex-col items-center justify-center p-4">
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".png,.jpg,.jpeg,.pdf,.xlsx,.csv,.xls,.doc,.docx"
                        disabled={isUploading}
                    />

                    {!file ? (
                        <div className="flex flex-col items-center gap-1.5 pointer-events-none text-muted-foreground group">
                            <UploadCloud className="h-6 w-6 text-primary/50" />
                            <p className="text-sm font-medium">{t('resources.upload.select_file')}</p>
                            <p className="text-xs">{t('resources.upload.file_types')}</p>
                        </div>
                    ) : (
                        <div className="w-full flex items-center justify-between pointer-events-none px-2 z-10 text-foreground">
                            <span className="text-sm font-medium truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                    {file && !isUploading && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)} className="shrink-0 text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full sm:w-auto gap-2 px-6"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('common.uploading')}
                            </>
                        ) : (
                            t('resources.upload.button')
                        )}
                    </Button>
                </div>
            </div>
            {error && <p className="text-sm font-medium text-destructive mt-3 text-center sm:text-left">{error}</p>}
        </div>
    )
}
