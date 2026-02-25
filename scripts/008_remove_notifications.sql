-- ============================================================
-- REMOVE NOTIFICATIONS
-- ============================================================

-- 1) Drop triggers
DROP TRIGGER IF EXISTS on_new_announcement ON public.announcements;
DROP TRIGGER IF EXISTS on_attendance_session_open ON public.attendance_sessions;
DROP TRIGGER IF EXISTS on_new_comment ON public.comments;

-- 2) Drop functions
DROP FUNCTION IF EXISTS public.notify_on_announcement();
DROP FUNCTION IF EXISTS public.notify_on_attendance_open();
DROP FUNCTION IF EXISTS public.notify_on_comment();

-- 3) Remove table from realtime publication
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN 
    ALTER PUBLICATION supabase_realtime DROP TABLE public.notifications; 
  END IF; 
END $$;

-- 4) Drop the notifications table
DROP TABLE IF EXISTS public.notifications CASCADE;
