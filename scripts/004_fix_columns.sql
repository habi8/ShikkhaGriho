-- Fix schema mismatches between actions and actual table columns

-- classrooms: add missing columns that the server action uses
ALTER TABLE public.classrooms
  ADD COLUMN IF NOT EXISTS cover_color TEXT NOT NULL DEFAULT '#b45309',
  ADD COLUMN IF NOT EXISTS section TEXT,
  ADD COLUMN IF NOT EXISTS room TEXT;

-- attendance_sessions: the action uses created_by but schema has teacher_id
-- Add created_by as alias (copy teacher_id semantics) so both work
ALTER TABLE public.attendance_sessions
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS title TEXT;

-- Update existing rows so created_by mirrors teacher_id
UPDATE public.attendance_sessions SET created_by = teacher_id WHERE created_by IS NULL;

-- attendance_records: action uses 'late' status but schema only allows 'present','absent','pending'
ALTER TABLE public.attendance_records
  DROP CONSTRAINT IF EXISTS attendance_records_status_check;
ALTER TABLE public.attendance_records
  ADD CONSTRAINT attendance_records_status_check
  CHECK (status IN ('present', 'absent', 'late', 'pending'));
