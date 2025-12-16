-- Create enums for Role and Status
CREATE TYPE user_role AS ENUM ('ADMIN', 'PERSONAL');
CREATE TYPE user_status AS ENUM ('PENDENTE', 'ATIVO', 'INATIVO');

-- Create users_profile table
CREATE TABLE public.users_profile (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'PERSONAL',
  status user_status NOT NULL DEFAULT 'PENDENTE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users_profile
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (name)
CREATE POLICY "Users can update own profile" ON public.users_profile
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to handle new user creation from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Usuário'),
    'PERSONAL',
    'PENDENTE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
