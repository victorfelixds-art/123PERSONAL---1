-- Create extension for password hashing if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_admin_uid UUID;
  v_demo_uid UUID;
BEGIN
  -- 1. Handle Admin User
  SELECT id INTO v_admin_uid FROM auth.users WHERE email = 'admin@gmail.com';
  
  IF v_admin_uid IS NULL THEN
    v_admin_uid := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      v_admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      crypt('admin', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"admin@gmail.com","role":"ADMIN"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Ensure Admin Profile in public.users_profile
  -- Use ON CONFLICT to handle both insertion (if trigger didn't run) and update (if it did)
  INSERT INTO public.users_profile (id, email, name, role, status)
  VALUES (v_admin_uid, 'admin@gmail.com', 'admin@gmail.com', 'ADMIN', 'ATIVO')
  ON CONFLICT (id) DO UPDATE SET
    role = 'ADMIN',
    status = 'ATIVO',
    name = 'admin@gmail.com';


  -- 2. Handle Demo Personal User
  SELECT id INTO v_demo_uid FROM auth.users WHERE email = 'demo@gmail.com';
  
  IF v_demo_uid IS NULL THEN
    v_demo_uid := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      v_demo_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'demo@gmail.com',
      crypt('demo', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"demo@gmail.com","role":"PERSONAL"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Ensure Demo Profile in public.users_profile
  INSERT INTO public.users_profile (id, email, name, role, status)
  VALUES (v_demo_uid, 'demo@gmail.com', 'demo@gmail.com', 'PERSONAL', 'ATIVO')
  ON CONFLICT (id) DO UPDATE SET
    role = 'PERSONAL',
    status = 'ATIVO',
    name = 'demo@gmail.com';

END $$;
