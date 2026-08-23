-- Initial schema for Bon Ton Fitness (Phase 1)

create table branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  manager_id uuid
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'member', -- member|trainer|staff|manager|super_admin
  branch_id uuid references branches(id),
  goal text,
  height_cm integer,
  current_weight numeric,
  membership_expires date,
  currently_in_gym boolean default false,
  last_checkin timestamp,
  last_checkout timestamp
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade,
  branch_id uuid references branches(id),
  check_in timestamp not null,
  check_out timestamp,
  duration_minutes integer,
  auto_closed boolean default false
);

create table equipment (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references branches(id),
  name text not null,
  status text default 'available' -- available|maintenance
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id),
  title text,
  body text,
  metadata jsonb,
  created_at timestamp default now()
);

-- seed branches
insert into branches (id, name, address, phone) values
  (gen_random_uuid(), 'HMT Layout', 'HMT Layout, Bengaluru', '+91 99999 00001'),
  (gen_random_uuid(), 'Anjana Nagar', 'Anjana Nagar, Bengaluru', '+91 99999 00002'),
  (gen_random_uuid(), 'Laggere', 'Laggere, Bengaluru', '+91 99999 00003'),
  (gen_random_uuid(), 'Chikka Gollarahatti', 'Chikka Gollarahatti, Bengaluru', '+91 99999 00004'),
  (gen_random_uuid(), 'Nelamangala', 'Nelamangala, Bengaluru', '+91 99999 00005');
