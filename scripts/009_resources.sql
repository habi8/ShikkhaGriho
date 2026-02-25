-- ============================================================
-- RESOURCES TABLE AND STORAGE SETUP
-- ============================================================

-- 1) Create the resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 3) RLS Policies for the table
CREATE POLICY "resources_select" ON public.resources FOR SELECT
  USING (
    public.is_classroom_teacher(classroom_id, auth.uid())
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

CREATE POLICY "resources_teacher_insert" ON public.resources FOR INSERT
  WITH CHECK (
    uploader_id = auth.uid()
    AND public.is_classroom_teacher(classroom_id, auth.uid())
  );

CREATE POLICY "resources_teacher_delete" ON public.resources FOR DELETE
  USING (
    uploader_id = auth.uid()
    AND public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- 4) Create Storage Bucket for resources
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resources', 'resources', true) 
ON CONFLICT (id) DO NOTHING;

-- 5) RLS Policies for Storage (Storage is handled differently in Supabase)
-- Public access for downloading (since the bucket is public, anyone with the URL can download it)
-- However, we can add a policy just to be thorough for SELECT:
CREATE POLICY "Public resources view"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resources' );

-- Teachers can upload/delete
CREATE POLICY "Teacher resources upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'resources' AND auth.role() = 'authenticated' );

CREATE POLICY "Teacher resources delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'resources' AND auth.role() = 'authenticated' );
