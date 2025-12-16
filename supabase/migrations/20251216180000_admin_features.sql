-- Create Enum for Subscription Status
CREATE TYPE public.subscription_status AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED');

-- Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.subscription_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for Subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Personals can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING ( auth.uid() = user_id );

-- Ensure Admins can manage users_profile
CREATE POLICY "Admins can view all profiles"
  ON public.users_profile FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON public.users_profile FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON public.users_profile FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

