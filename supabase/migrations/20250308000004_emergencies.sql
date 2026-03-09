-- Emergencies table: all emergency events (emergency calls + no-emergency flows)
CREATE TABLE IF NOT EXISTS public.emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('emergency', 'no_emergency')),
  situation TEXT,
  answers JSONB,
  location JSONB,
  selected_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- situation: medical, breakdown, assistance, other (for no_emergency)
-- answers: { key: value } from questions
-- location: { street, district, province, latitude, longitude, coordinates }
-- selected_number: 191, 1669, 1155 (for emergency)

ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own emergencies"
  ON public.emergencies FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can read own emergencies"
  ON public.emergencies FOR SELECT
  USING (auth.uid() = user_id);
