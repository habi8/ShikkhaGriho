-- ============================================================
-- FIX: Students cannot look up classrooms by invite code
-- ============================================================
-- When a student tries to join via invite code, the classrooms
-- RLS blocks them because they are not yet a member or teacher.
-- This SECURITY DEFINER function bypasses RLS for the lookup.
-- ============================================================

CREATE OR REPLACE FUNCTION public.lookup_classroom_by_invite(p_invite_code TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.classrooms
  WHERE invite_code = p_invite_code
  LIMIT 1;
$$;
