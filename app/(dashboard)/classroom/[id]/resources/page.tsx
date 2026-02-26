import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResourcesClient } from '@/components/classroom/resources-client'

interface PageProps {
    params: Promise<{ id: string }>
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

    return (
        <ResourcesClient
            classroomId={id}
            teacherId={user.id}
            isTeacher={isTeacher}
            resources={resources ?? []}
        />
    )
}
