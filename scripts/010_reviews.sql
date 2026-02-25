-- ============================================================
-- VISITOR REVIEWS SETUP
-- ============================================================

CREATE TABLE IF NOT EXISTS public.visitor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  review TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.visitor_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Public reviews select" ON public.visitor_reviews 
FOR SELECT USING (true);

-- Anyone can submit reviews
CREATE POLICY "Public reviews insert" ON public.visitor_reviews 
FOR INSERT WITH CHECK (true);
