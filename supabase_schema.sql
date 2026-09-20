-- ==============================================================================
-- 🌸 ANUBAMA M — SAKURA PORTFOLIO DATABASE SCHEMA
-- Supabase Postgres SQL Schema & Security Policies (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ADMIN USERS TABLE
create table if not exists public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  role text default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admin_users enable row level security;

create policy "Admins can view admin list" on public.admin_users
  for select using (auth.uid() = user_id or auth.email() = 'anubamam7@gmail.com');

-- 2. PROJECTS TABLE
create table if not exists public.projects (
  id text primary key,
  title text not null,
  year text default '2026',
  category text not null check (category in ('Frontend', 'Backend', 'Full Stack', 'Web Application')),
  short_description text not null,
  description text not null,
  key_features text[] default '{}',
  technologies text[] default '{}',
  github_url text,
  live_url text,
  image_url text,
  images text[] default '{}',
  featured boolean default false,
  status text default 'published' check (status in ('published', 'draft', 'archived')),
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Public can view published projects" on public.projects
  for select using (status = 'published' or status is null);

create policy "Admins can manage all projects" on public.projects
  for all using (
    exists (
      select 1 from public.admin_users where user_id = auth.uid()
    ) or auth.email() = 'anubamam7@gmail.com'
  );

-- 3. INBOUND CONTACT MESSAGES TABLE
create table if not exists public.messages (
  id text primary key,
  name text not null,
  email text not null,
  subject text default 'Portfolio Inquiry',
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Public can insert messages" on public.messages
  for insert with check (true);

create policy "Admins can view and manage messages" on public.messages
  for all using (
    exists (
      select 1 from public.admin_users where user_id = auth.uid()
    ) or auth.email() = 'anubamam7@gmail.com'
  );

-- 4. VISITOR COMMENTS & GUESTBOOK ENDORSEMENTS
create table if not exists public.comments (
  id text primary key,
  name text not null,
  role text,
  company text,
  comment text not null,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  avatar_color text default 'bg-pink-500',
  status text default 'approved' check (status in ('approved', 'pending', 'hidden')),
  parent_id text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Public can view approved comments" on public.comments
  for select using (status = 'approved');

create policy "Public can insert comments" on public.comments
  for insert with check (true);

create policy "Admins can manage comments" on public.comments
  for all using (
    exists (
      select 1 from public.admin_users where user_id = auth.uid()
    ) or auth.email() = 'anubamam7@gmail.com'
  );

-- 5. DEVELOPER PROFILE & SETTINGS TABLE
create table if not exists public.profile (
  id text primary key default 'anubama_profile',
  profile_image_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profile enable row level security;

create policy "Public can view profile" on public.profile
  for select using (true);

create policy "Admins can manage profile" on public.profile
  for all using (
    exists (
      select 1 from public.admin_users where user_id = auth.uid()
    ) or auth.email() = 'anubamam7@gmail.com'
  );

-- Pre-seed initial profile row if not present
insert into public.profile (id, profile_image_url)
values ('anubama_profile', null)
on conflict (id) do nothing;
