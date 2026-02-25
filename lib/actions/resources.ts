'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createResourceRecord(
    classroom_id: string,
    fileName: string,
    filePath: string,
    fileType: string,
    fileSize: number
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { error } = await supabase.from('resources').insert({
        classroom_id,
        uploader_id: user.id,
        file_name: fileName,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
    })

    if (error) throw error

    revalidatePath(`/classroom/${classroom_id}/resources`)
}

export async function deleteResource(id: string, filePath: string, classroom_id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // delete from storage
    await supabase.storage.from('resources').remove([filePath])

    // delete from db
    const { error } = await supabase.from('resources').delete().eq('id', id)

    if (error) throw error

    revalidatePath(`/classroom/${classroom_id}/resources`)
}
