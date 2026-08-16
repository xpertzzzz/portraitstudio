
DROP POLICY "public read categories" ON public.categories;
DROP POLICY "public read photographers" ON public.photographers;
DROP POLICY "public read packages" ON public.packages;
DROP POLICY "public read approved reviews" ON public.reviews;

CREATE POLICY "anon read categories" ON public.categories FOR SELECT TO anon USING (is_active);
CREATE POLICY "auth read categories" ON public.categories FOR SELECT TO authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anon read photographers" ON public.photographers FOR SELECT TO anon USING (is_active);
CREATE POLICY "auth read photographers" ON public.photographers FOR SELECT TO authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anon read packages" ON public.packages FOR SELECT TO anon USING (is_active);
CREATE POLICY "auth read packages" ON public.packages FOR SELECT TO authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anon read reviews" ON public.reviews FOR SELECT TO anon USING (status = 'approved');
CREATE POLICY "auth read reviews" ON public.reviews FOR SELECT TO authenticated USING (status = 'approved' OR public.has_role(auth.uid(),'admin'));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
