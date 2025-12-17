-- Create ENUM type for User Role
CREATE TYPE public.user_role_enum AS ENUM ('ADMIN', 'PERSONAL', 'STUDENT');

-- Create ENUM type for User Status
CREATE TYPE public.user_status_enum AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE');

-- Alter users_profile table to use the new ENUM types
-- We cast existing values to the new types using the USING clause with UPPER() to ensure case-insensitive matching
ALTER TABLE public.users_profile
  ALTER COLUMN role TYPE public.user_role_enum USING UPPER(role)::public.user_role_enum,
  ALTER COLUMN status TYPE public.user_status_enum USING UPPER(status)::public.user_status_enum;
