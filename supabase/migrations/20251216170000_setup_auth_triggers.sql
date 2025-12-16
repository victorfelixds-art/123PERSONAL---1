-- Create function to handle new user signup
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users_profile (id, email, name, role, status, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    'PERSONAL',
    'PENDENTE',
    now()
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Enable RLS
alter table public.users_profile enable row level security;

-- Policies
drop policy if exists "Users can view their own profile" on public.users_profile;
create policy "Users can view their own profile"
  on public.users_profile for select
  using ( auth.uid() = id );

drop policy if exists "Admins can view all profiles" on public.users_profile;
create policy "Admins can view all profiles"
  on public.users_profile for select
  using (
    exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'ADMIN'
    )
  );
