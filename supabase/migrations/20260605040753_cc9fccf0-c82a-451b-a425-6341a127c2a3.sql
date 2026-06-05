CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;

ALTER POLICY "Admins can delete newsletters" ON public.newsletters
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can insert newsletters" ON public.newsletters
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update newsletters" ON public.newsletters
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view all newsletters" ON public.newsletters
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Users delete own review" ON public.product_reviews
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Users update own review" ON public.product_reviews
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Anyone reads approved reviews" ON public.product_reviews
  USING ((approved = true) OR (auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete products" ON public.products
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can insert products" ON public.products
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update products" ON public.products
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete settings" ON public.site_settings
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can insert settings" ON public.site_settings
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update settings" ON public.site_settings
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins manage roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins view all roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP FUNCTION public.has_role(uuid, public.app_role);