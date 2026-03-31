-- Create users table
create table if not exists public.users (
  id text primary key,
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'student' check (role in ('student', 'admin', 'instructor')),
  cohort text,
  is_active boolean default true,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for email lookups
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);

-- Create user_sessions table for tracking active sessions
create table if not exists public.user_sessions (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  session_token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Create audit log for admin view
create table if not exists public.user_registrations (
  id bigint generated always as identity primary key,
  user_id text not null references public.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null,
  cohort text,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- Create index for real-time queries
create index if not exists idx_user_registrations_created on public.user_registrations(created_at desc);

-- Enable realtime on user_registrations table
alter table public.user_registrations replica identity full;
