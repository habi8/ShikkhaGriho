-- ShikkhaGriho Row Level Security Policies

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Allow viewing other profiles for classroom context (members list)
CREATE POLICY "profiles_select_for_members" ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members cm
      WHERE cm.student_id = public.profiles.id
        AND cm.classroom_id IN (
          SELECT id FROM public.classrooms WHERE teacher_id = auth.uid()
          UNION
          SELECT classroom_id FROM public.classroom_members WHERE student_id = auth.uid()
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.classrooms WHERE teacher_id = public.profiles.id
        AND id IN (
          SELECT classroom_id FROM public.classroom_members WHERE student_id = auth.uid()
        )
    )
  );

-- ============================================================
-- CLASSROOMS
-- ============================================================
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "classrooms_teacher_all" ON public.classrooms
  FOR ALL USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "classrooms_member_select" ON public.classrooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members
      WHERE classroom_id = public.classrooms.id
        AND student_id = auth.uid()
        AND is_banned = FALSE
    )
  );

-- ============================================================
-- CLASSROOM MEMBERS
-- ============================================================
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;

-- Teacher can see all members of their classrooms
CREATE POLICY "members_teacher_select" ON public.classroom_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
  );

-- Students can see members of classrooms they belong to
CREATE POLICY "members_student_select" ON public.classroom_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.classroom_members cm WHERE cm.classroom_id = public.classroom_members.classroom_id AND cm.student_id = auth.uid())
  );

-- Teacher can manage members
CREATE POLICY "members_teacher_all" ON public.classroom_members FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
  );

-- Students can join (insert themselves)
CREATE POLICY "members_student_insert" ON public.classroom_members FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can leave (delete themselves)
CREATE POLICY "members_student_delete" ON public.classroom_members FOR DELETE
  USING (student_id = auth.uid());

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_select" ON public.announcements FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = public.announcements.classroom_id AND student_id = auth.uid() AND is_banned = FALSE)
  );

CREATE POLICY "announcements_teacher_insert" ON public.announcements FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
  );

CREATE POLICY "announcements_teacher_update" ON public.announcements FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "announcements_teacher_delete" ON public.announcements FOR DELETE
  USING (author_id = auth.uid());

-- ============================================================
-- COMMENTS
-- ============================================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select" ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.announcements a
      WHERE a.id = announcement_id
        AND (
          EXISTS (SELECT 1 FROM public.classrooms WHERE id = a.classroom_id AND teacher_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = a.classroom_id AND student_id = auth.uid() AND is_banned = FALSE)
        )
    )
  );

CREATE POLICY "comments_insert" ON public.comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.announcements a
      WHERE a.id = announcement_id
        AND (
          EXISTS (SELECT 1 FROM public.classrooms WHERE id = a.classroom_id AND teacher_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = a.classroom_id AND student_id = auth.uid() AND is_banned = FALSE)
        )
    )
  );

CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (author_id = auth.uid());

-- ============================================================
-- ATTENDANCE SESSIONS
-- ============================================================
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_sessions_teacher_all" ON public.attendance_sessions
  FOR ALL USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "attendance_sessions_member_select" ON public.attendance_sessions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = public.attendance_sessions.classroom_id AND student_id = auth.uid() AND is_banned = FALSE)
  );

-- ============================================================
-- ATTENDANCE RECORDS
-- ============================================================
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_records_teacher_all" ON public.attendance_records
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      JOIN public.classrooms c ON c.id = s.classroom_id
      WHERE s.id = session_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      JOIN public.classrooms c ON c.id = s.classroom_id
      WHERE s.id = session_id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "attendance_records_student_select" ON public.attendance_records FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "attendance_records_student_insert" ON public.attendance_records FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.is_open = TRUE
    )
  );

CREATE POLICY "attendance_records_student_update" ON public.attendance_records FOR UPDATE
  USING (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.is_open = TRUE
    )
  );

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- PENDING INVITES
-- ============================================================
ALTER TABLE public.pending_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_invites_teacher_all" ON public.pending_invites
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.classrooms WHERE id = classroom_id AND teacher_id = auth.uid())
  );
