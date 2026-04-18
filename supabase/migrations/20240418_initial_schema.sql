-- Users table: id (uuid, pk), email (text, unique), plan (text, default 'free'), created_at.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages table: id (uuid, pk), user_id (uuid, fk to users.id), message (text), response (text), created_at.
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security) - Basic Setup
-- NOTE: In a production environment, you should add more restrictive policies.
-- For now, we allow read/write to simplify development.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated/anon users to read/insert for development (DANGEROUS FOR PROD, but OK for local UI tests)
CREATE POLICY "Enable all for development - users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for development - messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
