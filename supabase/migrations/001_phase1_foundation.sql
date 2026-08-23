-- Bon Ton Fitness Phase 1 foundation
-- Apply with: supabase db push

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('member', 'trainer', 'staff', 'manager', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.attendance_event_source as enum ('biometric', 'manual', 'system');
exception when duplicate_object then null;
end $$;

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  address text,
  phone text,
  maps_url text,
  default_session_minutes integer not null default 120 check (default_session_minutes between 30 and 360),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Bon Ton member',
  phone text,
  biometric_identifier text unique,
  role public.app_role not null default 'member',
  branch_id uuid references public.branches(id) on delete set null,
  avatar_url text,
  fitness_goal text check (fitness_goal in ('Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'General Fitness', 'Weight Maintenance')),
  height_cm numeric(5,2),
  starting_weight_kg numeric(6,2),
  current_weight_kg numeric(6,2),
  membership_status text not null default 'active' check (membership_status in ('active', 'paused', 'expired', 'pending')),
  membership_expires_at date,
  currently_in_gym boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainer_member_assignments (
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (trainer_id, member_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  check_in_at timestamptz not null,
  check_out_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  source public.attendance_event_source not null default 'biometric',
  auto_closed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists one_open_attendance_per_member
  on public.attendance(member_id) where check_out_at is null;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  name text not null,
  category text,
  status text not null default 'available' check (status in ('available', 'maintenance')),
  created_at timestamptz not null default now(),
  unique (branch_id, name)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'Bon Ton member'), new.phone, 'member')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_branch_id()
returns uuid language sql stable security definer set search_path = public as $$
  select branch_id from public.profiles where id = auth.uid();
$$;

create or replace function public.can_access_branch(target_branch_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.current_user_role() = 'admin' or public.current_user_branch_id() = target_branch_id;
$$;

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.trainer_member_assignments enable row level security;
alter table public.attendance enable row level security;
alter table public.notifications enable row level security;
alter table public.equipment enable row level security;

drop policy if exists "branches are visible to authenticated users" on public.branches;
create policy "branches are visible to authenticated users" on public.branches for select to authenticated using (true);

drop policy if exists "profiles can be read by the right workspace" on public.profiles;
create policy "profiles can be read by the right workspace" on public.profiles for select to authenticated using (
  id = auth.uid()
  or public.current_user_role() = 'admin'
  or (public.current_user_role() in ('staff', 'manager') and branch_id = public.current_user_branch_id())
  or (public.current_user_role() = 'trainer' and exists (
    select 1 from public.trainer_member_assignments a
    where a.trainer_id = auth.uid() and a.member_id = profiles.id
  ))
);

drop policy if exists "members can update their own profile" on public.profiles;
create policy "members can update their own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "workspace roles can manage profiles" on public.profiles;
create policy "workspace roles can manage profiles" on public.profiles for all to authenticated using (
  public.current_user_role() = 'admin'
  or (public.current_user_role() in ('staff', 'manager') and branch_id = public.current_user_branch_id())
) with check (
  public.current_user_role() = 'admin'
  or (public.current_user_role() in ('staff', 'manager') and branch_id = public.current_user_branch_id())
);

drop policy if exists "attendance follows workspace access" on public.attendance;
create policy "attendance follows workspace access" on public.attendance for select to authenticated using (
  member_id = auth.uid() or public.can_access_branch(branch_id)
  or exists (select 1 from public.trainer_member_assignments a where a.trainer_id = auth.uid() and a.member_id = attendance.member_id)
);

drop policy if exists "members can read their notifications" on public.notifications;
create policy "members can read their notifications" on public.notifications for select to authenticated using (member_id = auth.uid());

drop policy if exists "members can update their notifications" on public.notifications;
create policy "members can update their notifications" on public.notifications for update to authenticated using (member_id = auth.uid()) with check (member_id = auth.uid());

drop policy if exists "equipment follows branch access" on public.equipment;
create policy "equipment follows branch access" on public.equipment for select to authenticated using (public.can_access_branch(branch_id));

drop policy if exists "operators can manage equipment" on public.equipment;
create policy "operators can manage equipment" on public.equipment for all to authenticated using (
  public.current_user_role() = 'admin' or (public.current_user_role() in ('staff', 'manager') and branch_id = public.current_user_branch_id())
) with check (
  public.current_user_role() = 'admin' or (public.current_user_role() in ('staff', 'manager') and branch_id = public.current_user_branch_id())
);

insert into public.branches (name, address, phone, maps_url) values
  ('HMT Layout', 'Bengaluru North', '7022888883', 'https://maps.app.goo.gl/RYEPKyz4RJ5RRmiZ7'),
  ('Anjana Nagar', 'Bengaluru West', '9902445444', 'https://maps.app.goo.gl/G9qK9QZzFLrWi3WNA'),
  ('Laggere', 'Bengaluru North', '7353188199', 'https://maps.app.goo.gl/wknvfgW5sBM7qRfZ7'),
  ('Chikka Gollarahatti', 'Bengaluru West', '9740199177', 'https://maps.app.goo.gl/VxhmVNHkhArBfUpL6'),
  ('Nelamangala', 'Bengaluru Rural', '9949994712', 'https://maps.app.goo.gl/N3PLCxEW1YsfGoLT9')
on conflict (name) do update set address = excluded.address, phone = excluded.phone, maps_url = excluded.maps_url;

-- Called by a scheduled Supabase job every 15 minutes to protect against missing biometric check-outs.
create or replace function public.auto_close_stale_attendance()
returns integer language plpgsql security definer set search_path = public as $$
declare
  closed_count integer;
begin
  with stale as (
    update public.attendance a
    set check_out_at = a.check_in_at + make_interval(mins => b.default_session_minutes),
        duration_minutes = b.default_session_minutes,
        source = 'system',
        auto_closed = true
    from public.branches b
    where a.branch_id = b.id
      and a.check_out_at is null
      and a.check_in_at < now() - make_interval(mins => b.default_session_minutes)
    returning a.id, a.member_id, a.branch_id, a.duration_minutes
  ), member_updates as (
    update public.profiles p
    set currently_in_gym = false
    where p.id in (select member_id from stale)
    returning p.id
  )
  insert into public.notifications(member_id, title, message)
  select s.member_id, 'Session auto-closed', 'Your attendance session was closed after the usual session window.'
  from stale s;
  get diagnostics closed_count = row_count;
  return closed_count;
end;
$$;
