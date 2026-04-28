-- Stores table: Shopify store connections per user
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shop_domain TEXT NOT NULL,
  access_token TEXT NOT NULL,
  shop_name TEXT,
  shop_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(shop_domain)
);

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Users can only access their own store connections
CREATE POLICY "Users can view own stores"
  ON public.stores
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stores"
  ON public.stores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stores"
  ON public.stores
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stores"
  ON public.stores
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow service role to manage all stores
CREATE POLICY "Service role can manage all stores"
  ON public.stores
  FOR ALL
  USING (true)
  WITH CHECK (true);
