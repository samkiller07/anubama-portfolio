-- ==============================================================================
-- 🌸 ANUBAMA M — SAKURA PORTFOLIO COMPLETE DATABASE & STORAGE SCHEMA
-- Execute in the Supabase SQL Editor (Project: https://hkzwywqlmtpkymqyddow.supabase.co)
-- Fully Idempotent (safe to run multiple times without conflict)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  role text default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can view admin list" on public.admin_users;
create policy "Admins can view admin list" on public.admin_users
  for select using (auth.uid() = user_id or auth.email() = 'anubamam7@gmail.com');

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.projects (
  id text primary key,
  title text not null,
  year text default '2026',
  category text not null,
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
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects" on public.projects
  for select using (status = 'published' or status is null);

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects" on public.projects
  for insert with check (true);

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects" on public.projects
  for update using (true);

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects" on public.projects
  for delete using (true);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  icon text default 'code',
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories" on public.categories
  for select using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories" on public.categories
  for all using (true);

-- Pre-seed default categories
insert into public.categories (id, name, slug, description, icon, order_index)
values
  ('cat-1', 'Frontend', 'frontend', 'Client-side interfaces and user experiences', 'layout', 1),
  ('cat-2', 'Backend', 'backend', 'Server logic, APIs, and microservices', 'server', 2),
  ('cat-3', 'Full Stack', 'full-stack', 'End-to-end full stack web solutions', 'code', 3),
  ('cat-4', 'Web Application', 'web-app', 'Dynamic single-page applications', 'network', 4)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 4. INBOUND CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
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

drop policy if exists "Public can insert messages" on public.messages;
create policy "Public can insert messages" on public.messages
  for insert with check (true);

drop policy if exists "Admins can manage messages" on public.messages;
create policy "Admins can manage messages" on public.messages
  for all using (true);

-- ------------------------------------------------------------------------------
-- 5. VISITOR COMMENTS & GUESTBOOK ENDORSEMENTS
-- ------------------------------------------------------------------------------
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

drop policy if exists "Public can view approved comments" on public.comments;
create policy "Public can view approved comments" on public.comments
  for select using (status = 'approved');

drop policy if exists "Public can insert comments" on public.comments;
create policy "Public can insert comments" on public.comments
  for insert with check (true);

drop policy if exists "Admins can manage comments" on public.comments;
create policy "Admins can manage comments" on public.comments
  for all using (true);

-- ------------------------------------------------------------------------------
-- 6. DEVELOPER PROFILE & SETTINGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.profile (
  id text primary key default 'anubama_profile',
  profile_image_url text,
  headline text,
  bio text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profile enable row level security;

drop policy if exists "Public can view profile" on public.profile;
create policy "Public can view profile" on public.profile
  for select using (true);

drop policy if exists "Admins can manage profile" on public.profile;
create policy "Admins can manage profile" on public.profile
  for all using (true);

-- Pre-seed initial profile singleton row
insert into public.profile (id, profile_image_url)
values ('anubama_profile', null)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 7. GRANTS FOR PUBLIC ANON & AUTHENTICATED ROLES
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;

-- ------------------------------------------------------------------------------
-- 8. STORAGE BUCKET & POLICIES (for cross-device avatar and project imagery)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'anubama-portfolio-media',
  'anubama-portfolio-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set public = true;

-- Storage object policies for anubama-portfolio-media
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'anubama-portfolio-media');

drop policy if exists "Allow insert media" on storage.objects;
create policy "Allow insert media" on storage.objects
  for insert with check (bucket_id = 'anubama-portfolio-media');

drop policy if exists "Allow update media" on storage.objects;
create policy "Allow update media" on storage.objects
  for update using (bucket_id = 'anubama-portfolio-media');

drop policy if exists "Allow delete media" on storage.objects;
create policy "Allow delete media" on storage.objects
  for delete using (bucket_id = 'anubama-portfolio-media');
