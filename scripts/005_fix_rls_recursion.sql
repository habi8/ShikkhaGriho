-- ============================================================
-- FIX: Infinite recursion in classrooms ↔ classroom_members RLS
-- ============================================================
-- The problem: classrooms SELECT policy checks classroom_members,
-- but classroom_members SELECT policy checks classrooms → loop.
--
-- The fix: use SECURITY DEFINER functions that bypass RLS for
-- internal ownership/membership checks, breaking the cycle.
-- ============================================================

-- 1) Helper: check if a user is the teacher/owner of a classroom
--    (bypasses RLS on classrooms)
CREATE OR REPLACE FUNCTION public.is_classroom_teacher(p_classroom_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = p_classroom_id AND teacher_id = p_user_id
  );
$$;

-- 2) Helper: check if a user is a (non-banned) member of a classroom
--    (bypasses RLS on classroom_members)
CREATE OR REPLACE FUNCTION public.is_classroom_member(p_classroom_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classroom_members
    WHERE classroom_id = p_classroom_id
      AND student_id = p_user_id
      AND is_banned = FALSE
  );
$$;

-- ============================================================
-- Drop the old problematic policies
-- ============================================================

-- Classrooms
DROP POLICY IF EXISTS "classrooms_teacher_all"    ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_member_select"   ON public.classrooms;

-- Classroom members
DROP POLICY IF EXISTS "members_teacher_select"     ON public.classroom_members;
DROP POLICY IF EXISTS "members_student_select"     ON public.classroom_members;
DROP POLICY IF EXISTS "members_teacher_all"        ON public.classroom_members;
DROP POLICY IF EXISTS "members_student_insert"     ON public.classroom_members;
DROP POLICY IF EXISTS "members_student_delete"     ON public.classroom_members;

-- Announcements (also reference classrooms)
DROP POLICY IF EXISTS "announcements_select"          ON public.announcements;
DROP POLICY IF EXISTS "announcements_teacher_insert"  ON public.announcements;

-- Comments (also reference classrooms through announcements)
DROP POLICY IF EXISTS "comments_select"  ON public.comments;
DROP POLICY IF EXISTS "comments_insert"  ON public.comments;

-- Attendance sessions
DROP POLICY IF EXISTS "attendance_sessions_member_select" ON public.attendance_sessions;

-- Pending invites
DROP POLICY IF EXISTS "pending_invites_teacher_all" ON public.pending_invites;

-- Profiles (classroom-context viewing)
DROP POLICY IF EXISTS "profiles_select_for_members" ON public.profiles;

-- ============================================================
-- Recreate CLASSROOMS policies (no more recursion)
-- ============================================================

-- Teacher has full access to their own classrooms
CREATE POLICY "classrooms_teacher_all" ON public.classrooms
  FOR ALL
  USING  (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Students who are members can SELECT the classroom
-- Uses the SECURITY DEFINER function → no RLS re-evaluation on classroom_members
CREATE POLICY "classrooms_member_select" ON public.classrooms
  FOR SELECT
  USING (
    public.is_classroom_member(id, auth.uid())
  );

-- ============================================================
-- Recreate CLASSROOM_MEMBERS policies (no more recursion)
-- ============================================================

-- Teacher can see members of their classrooms
-- Uses SECURITY DEFINER function → no RLS re-evaluation on classrooms
CREATE POLICY "members_teacher_select" ON public.classroom_members
  FOR SELECT
  USING (
    public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- Students can see members of classrooms they belong to
-- Uses SECURITY DEFINER function → no RLS re-evaluation on classroom_members
CREATE POLICY "members_student_select" ON public.classroom_members
  FOR SELECT
  USING (
    public.is_classroom_member(classroom_id, auth.uid())
  );

-- Teacher can manage (insert/update/delete) members
CREATE POLICY "members_teacher_all" ON public.classroom_members
  FOR ALL
  USING  (public.is_classroom_teacher(classroom_id, auth.uid()))
  WITH CHECK (public.is_classroom_teacher(classroom_id, auth.uid()));

-- Students can join (insert themselves)
CREATE POLICY "members_student_insert" ON public.classroom_members
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can leave (delete themselves)
CREATE POLICY "members_student_delete" ON public.classroom_members
  FOR DELETE
  USING (student_id = auth.uid());

-- ============================================================
-- Recreate ANNOUNCEMENTS policies (use helper functions)
-- ============================================================

CREATE POLICY "announcements_select" ON public.announcements
  FOR SELECT
  USING (
    public.is_classroom_teacher(classroom_id, auth.uid())
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

CREATE POLICY "announcements_teacher_insert" ON public.announcements
  FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- ============================================================
-- Recreate COMMENTS policies (use helper functions)
-- ============================================================

CREATE POLICY "comments_select" ON public.comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.announcements a
      WHERE a.id = announcement_id
        AND (
          public.is_classroom_teacher(a.classroom_id, auth.uid())
          OR public.is_classroom_member(a.classroom_id, auth.uid())
        )
    )
  );

CREATE POLICY "comments_insert" ON public.comments
  FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.announcements a
      WHERE a.id = announcement_id
        AND (
          public.is_classroom_teacher(a.classroom_id, auth.uid())
          OR public.is_classroom_member(a.classroom_id, auth.uid())
        )
    )
  );

-- ============================================================
-- Recreate ATTENDANCE SESSIONS member policy
-- ============================================================

CREATE POLICY "attendance_sessions_member_select" ON public.attendance_sessions
  FOR SELECT
  USING (
    public.is_classroom_member(classroom_id, auth.uid())
  );

-- ============================================================
-- Recreate PENDING INVITES policy
-- ============================================================

CREATE POLICY "pending_invites_teacher_all" ON public.pending_invites
  FOR ALL
  USING  (public.is_classroom_teacher(classroom_id, auth.uid()))
  WITH CHECK (public.is_classroom_teacher(classroom_id, auth.uid()));

-- ============================================================
-- Recreate PROFILES classroom-context policy
-- ============================================================

CREATE POLICY "profiles_select_for_members" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members cm
      WHERE cm.student_id = public.profiles.id
        AND (
          public.is_classroom_teacher(cm.classroom_id, auth.uid())
          OR public.is_classroom_member(cm.classroom_id, auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.teacher_id = public.profiles.id
        AND public.is_classroom_member(c.id, auth.uid())
    )
  );
