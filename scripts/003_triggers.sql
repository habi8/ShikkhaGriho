-- ShikkhaGriho Triggers

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email, phone, institution, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'username', NULL),
    COALESCE(NEW.email, NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'institution', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Check for pending invites and auto-enroll
  INSERT INTO public.classroom_members (classroom_id, student_id)
  SELECT pi.classroom_id, NEW.id
  FROM public.pending_invites pi
  WHERE pi.email = NEW.email
  ON CONFLICT (classroom_id, student_id) DO NOTHING;

  -- Delete processed invites
  DELETE FROM public.pending_invites WHERE email = NEW.email;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS classrooms_updated_at ON public.classrooms;
CREATE TRIGGER classrooms_updated_at BEFORE UPDATE ON public.classrooms FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS announcements_updated_at ON public.announcements;
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- NOTIFICATION ON NEW ANNOUNCEMENT
-- ============================================================
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

  INSERT INTO public.notifications (user_id, title, body, type, classroom_id)
  SELECT
    cm.student_id,
    'New Announcement in ' || classroom_name,
    SUBSTRING(NEW.content FROM 1 FOR 100),
    'announcement',
    NEW.classroom_id
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

-- ============================================================
-- NOTIFICATION ON ATTENDANCE SESSION OPEN
-- ============================================================
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

    INSERT INTO public.notifications (user_id, title, body, type, classroom_id)
    SELECT
      cm.student_id,
      'Attendance Open: ' || classroom_name,
      'Mark your attendance now for ' || NEW.title,
      'attendance',
      NEW.classroom_id
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
