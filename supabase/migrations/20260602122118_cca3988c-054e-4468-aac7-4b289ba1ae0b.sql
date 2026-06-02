
ALTER TABLE public.newsletters
  ADD COLUMN IF NOT EXISTS scheduled_for timestamptz,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS links jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

-- Public should only see published newsletters whose scheduled_for has passed (or is null)
DROP POLICY IF EXISTS "Anyone can view newsletters" ON public.newsletters;
CREATE POLICY "Public can view published newsletters"
ON public.newsletters
FOR SELECT
TO anon, authenticated
USING (
  published = true
  AND (scheduled_for IS NULL OR scheduled_for <= now())
);

CREATE POLICY "Admins can view all newsletters"
ON public.newsletters
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
