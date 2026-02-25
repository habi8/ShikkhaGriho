-- ============================================================
-- FIX: Notification system improvements
-- ============================================================

-- 1) Add 'link' column to notifications if it doesn't exist
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS link TEXT;

-- 2) Update existing announcement trigger to include link
CREATE OR REPLACE FUNCTION public.notify_on_announcement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  classroom_name TEXT;
BEGIN
  SELECT name INTO classroom_name FROM public.classrooms WHERE id = NEW.classroom_id;

  INSERT INTO public.notifications (user_id, title, body, type, classroom_id, link)
  SELECT
    cm.student_id,
    'New Announcement in ' || classroom_name,
    SUBSTRING(NEW.content FROM 1 FOR 100),
    'announcement',
    NEW.classroom_id,
    '/classroom/' || NEW.classroom_id
  FROM public.classroom_members cm
  WHERE cm.classroom_id = NEW.classroom_id
    AND cm.student_id != NEW.author_id
    AND cm.is_banned = FALSE;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_new_announcement ON public.announcements;
CREATE TRIGGER on_new_announcement
  AFTER INSERT ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_announcement();

-- 3) Update attendance trigger to include link
CREATE OR REPLACE FUNCTION public.notify_on_attendance_open()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  classroom_name TEXT;
BEGIN
  IF NEW.is_open = TRUE THEN
    SELECT name INTO classroom_name FROM public.classrooms WHERE id = NEW.classroom_id;

    INSERT INTO public.notifications (user_id, title, body, type, classroom_id, link)
    SELECT
      cm.student_id,
      'Attendance Open: ' || classroom_name,
      'Mark your attendance now for ' || COALESCE(NEW.title, 'Attendance Session'),
      'attendance',
      NEW.classroom_id,
      '/classroom/' || NEW.classroom_id || '/attendance'
    FROM public.classroom_members cm
    WHERE cm.classroom_id = NEW.classroom_id
      AND cm.is_banned = FALSE;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_attendance_session_open ON public.attendance_sessions;
CREATE TRIGGER on_attendance_session_open
  AFTER INSERT ON public.attendance_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_attendance_open();

-- 4) NEW: Notify teacher when someone comments on an announcement
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_classroom_id UUID;
  v_classroom_name TEXT;
  v_teacher_id UUID;
  v_commenter_name TEXT;
BEGIN
  -- Get the classroom from the announcement
  SELECT a.classroom_id INTO v_classroom_id
  FROM public.announcements a
  WHERE a.id = NEW.announcement_id;

  -- Get classroom info and teacher
  SELECT c.name, c.teacher_id INTO v_classroom_name, v_teacher_id
  FROM public.classrooms c
  WHERE c.id = v_classroom_id;

  -- Get commenter name
  SELECT COALESCE(p.full_name, 'Someone') INTO v_commenter_name
  FROM public.profiles p
  WHERE p.id = NEW.author_id;

  -- Don't notify if teacher is commenting on their own announcement
  IF NEW.author_id != v_teacher_id THEN
    INSERT INTO public.notifications (user_id, title, body, type, classroom_id, link)
    VALUES (
      v_teacher_id,
      'New Comment in ' || v_classroom_name,
      v_commenter_name || ': ' || SUBSTRING(NEW.content FROM 1 FOR 80),
      'comment',
      v_classroom_id,
      '/classroom/' || v_classroom_id
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_new_comment ON public.comments;
CREATE TRIGGER on_new_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_comment();

-- 5) Enable Supabase Realtime on the notifications table (idempotent)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications; 
  END IF; 
END $$;
