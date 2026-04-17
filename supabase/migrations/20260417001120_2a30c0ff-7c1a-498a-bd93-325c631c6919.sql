CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT 'INV-' || nextval('public.invoice_seq')::TEXT;
$$;