-- Add client specific columns to users_profile
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS personal_id UUID REFERENCES public.users_profile(id),
ADD COLUMN IF NOT EXISTS height NUMERIC,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS initial_weight NUMERIC,
ADD COLUMN IF NOT EXISTS target_weight NUMERIC,
ADD COLUMN IF NOT EXISTS objective TEXT;

-- Create weight_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.weight_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users_profile(id) NOT NULL,
    weight NUMERIC NOT NULL,
    date DATE NOT NULL,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on weight_history
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;

-- Policy for reading weight history (User can read their own, Personal can read their students')
CREATE POLICY "Users can view own weight history" ON public.weight_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Personals can view their students weight history" ON public.weight_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile
            WHERE id = weight_history.user_id
            AND personal_id = auth.uid()
        )
    );

-- Policy for inserting weight history
CREATE POLICY "Users can insert own weight history" ON public.weight_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Personals can insert students weight history" ON public.weight_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users_profile
            WHERE id = weight_history.user_id
            AND personal_id = auth.uid()
        )
    );
