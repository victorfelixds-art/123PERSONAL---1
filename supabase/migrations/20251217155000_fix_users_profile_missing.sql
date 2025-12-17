-- Fix for missing users_profile table causing seed_users.sql to fail
-- This migration ensures the users_profile table and associated triggers exist
-- It runs before 20251217160000_seed_users.sql to satisfy its dependencies

-- Create users_profile table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, name, email, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Sem Nome'),
    COALESCE(NEW.email, 'sem_email@exemplo.com'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT'),
    'PENDENTE'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any missing profiles from existing auth.users
-- This ensures that if auth.users were created in a previous failed run, they get a profile
INSERT INTO public.users_profile (id, name, email, role, status)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'name', email, 'Sem Nome'), 
    COALESCE(email, 'sem_email@exemplo.com'), 
    COALESCE(raw_user_meta_data->>'role', 'STUDENT'),
    'PENDENTE'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users_profile);
