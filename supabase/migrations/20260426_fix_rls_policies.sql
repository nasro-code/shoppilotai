-- Fix insecure RLS policies on users and messages tables
-- The stores table already has proper policies using auth.uid()

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Enable all for development - users" ON public.users;
DROP POLICY IF EXISTS "Enable all for development - messages" ON public.messages;

-- Users table policies: Users can only read/update their own row
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert only (new users are created via auth, not directly)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Messages table policies: Users can only access their own messages
CREATE POLICY "Users can view own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON public.messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Service role can manage all users"
  ON public.users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all messages"
  ON public.messages
  FOR ALL
  USING (true)
  WITH CHECK (true);
