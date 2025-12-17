CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
  demo_id UUID := gen_random_uuid();
BEGIN
  -- Insert Admin User if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      crypt('admin', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin User", "role": "ADMIN"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Insert Demo User if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      demo_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'demo@gmail.com',
      crypt('demo', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Demo Personal", "role": "PERSONAL"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Update statuses and roles ensuring they match requirements
  -- Trigger created previously handles insertion into users_profile, but we ensure correctness here
  
  -- Force update for Admin
  UPDATE public.users_profile 
  SET role = 'ADMIN', status = 'ATIVO' 
  WHERE email = 'admin@gmail.com';

  -- Force update for Demo
  UPDATE public.users_profile 
  SET role = 'PERSONAL', status = 'ATIVO' 
  WHERE email = 'demo@gmail.com';

END $$;
