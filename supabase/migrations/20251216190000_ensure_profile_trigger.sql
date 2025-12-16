-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'PERSONAL' CHECK (role IN ('ADMIN', 'PERSONAL', 'STUDENT')),
    status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('ATIVO', 'INATIVO', 'PENDENTE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    avatar_url TEXT,
    phone TEXT
);

-- Enable RLS
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid conflicts if they exist)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users_profile;

CREATE POLICY "Public profiles are viewable by everyone" ON public.users_profile FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users_profile FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'PERSONAL'),
    'PENDENTE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
