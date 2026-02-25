import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResourceUpload } from '@/components/classroom/resource-upload'
import { EmptyState } from '@/components/empty-state'
import { FileText, Download, Trash2, File, FileCode, FileImage, FileBarChart2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { deleteResource } from '@/lib/actions/resources'

interface PageProps {
    params: Promise<{ id: string }>
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default async function ResourcesPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const [
        { data: { user } },
        { data: classroom },
        { data: resources },
    ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('classrooms').select('teacher_id').eq('id', id).single(),
        supabase
            .from('resources')
            .select('*, profiles(id, full_name, avatar_url)')
            .eq('classroom_id', id)
            .order('created_at', { ascending: false }),
    ])

    if (!user) redirect('/auth/login')

    const isTeacher = classroom?.teacher_id === user.id

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('image')) return <FileImage className="h-5 w-5 text-blue-500" />
        if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileBarChart2 className="h-5 w-5 text-green-500" />
        if (fileType.includes('wordprocessing') || fileType.includes('document')) return <FileText className="h-5 w-5 text-indigo-500" />
        if (fileType.includes('csv') || fileType.includes('zip') || fileType.includes('archive')) return <FileCode className="h-5 w-5 text-yellow-500" />
        return <File className="h-5 w-5 text-muted-foreground" />
    }

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
            {/* Upload area (Teacher only) */}
            {isTeacher && <ResourceUpload classroomId={id} teacherId={user.id} />}

            {/* Resource list */}
            <h2 className="text-xl font-bold text-foreground">Classroom Materials</h2>

            {resources?.length === 0 ? (
                <EmptyState
                    title="No resources yet"
                    description={isTeacher ? 'Upload files to share them with your students.' : 'Your teacher has not uploaded any materials yet.'}
                    icon={<FileText className="h-7 w-7" />}
                />
            ) : (
                <div className="space-y-3">
                    {resources?.map((resource: any) => {
                        // Generate public URL for download
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
                                            <span>Uploaded {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4 shrink-0">
                                    <a href={downloadUrl} download={resource.file_name}>
                                        <Button variant="secondary" size="sm" className="gap-2 shrink-0">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    </a>

                                    {isTeacher && (
                                        <form action={async () => {
                                            'use server'
                                            await deleteResource(resource.id, resource.file_path, id)
                                        }}>
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
