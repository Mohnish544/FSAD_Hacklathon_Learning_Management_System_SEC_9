-- Users table for authentication and account management
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

-- Create indexes on users
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);

-- User sessions table for tracking active sessions
create table if not exists public.user_sessions (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  session_token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- User registrations audit log (for admin real-time notifications)
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

-- Create index for real-time queries on registrations
create index if not exists idx_user_registrations_created on public.user_registrations(created_at desc);

-- Enable realtime on user_registrations table
alter table public.user_registrations replica identity full;

create table if not exists public.courses (
  id text primary key,
  title text not null,
  track text not null,
  level text not null,
  thumbnail text not null,
  instructor text not null,
  description text not null,
  created_at timestamptz default now()
);

create table if not exists public.enrollments (
  user_id text not null,
  course_id text not null references public.courses(id) on delete cascade,
  progress int not null default 0,
  streak_days int not null default 0,
  primary key (user_id, course_id)
);

create table if not exists public.platform_metrics (
  id bigint generated always as identity primary key,
  active_learners int not null,
  completion_rate int not null,
  average_quiz_score int not null,
  assignment_submission_rate int not null,
  created_at timestamptz default now()
);

create table if not exists public.course_modules (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  overview text not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.module_lessons (
  id text primary key,
  module_id text not null references public.course_modules(id) on delete cascade,
  title text not null,
  video_url text not null,
  duration_minutes int not null,
  summary text,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.module_readings (
  id text primary key,
  module_id text not null references public.course_modules(id) on delete cascade,
  title text not null,
  content_type text not null,
  url text not null,
  estimated_minutes int not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.module_quizzes (
  id text primary key,
  module_id text not null references public.course_modules(id) on delete cascade,
  title text not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.quiz_questions (
  id text primary key,
  quiz_id text not null references public.module_quizzes(id) on delete cascade,
  question_type text not null,
  prompt text not null,
  options jsonb not null,
  correct_option int not null,
  explanation text,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.student_lesson_progress (
  user_id text not null,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text not null references public.course_modules(id) on delete cascade,
  lesson_id text not null references public.module_lessons(id) on delete cascade,
  completed boolean not null default false,
  last_viewed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.student_quiz_attempts (
  id bigint generated always as identity primary key,
  user_id text not null,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text not null references public.course_modules(id) on delete cascade,
  quiz_id text not null references public.module_quizzes(id) on delete cascade,
  score int not null,
  attempted_at timestamptz default now()
);
