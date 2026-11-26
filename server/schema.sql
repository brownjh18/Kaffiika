-- Run this in Supabase SQL Editor

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text,
  provider text not null default 'email',
  photo_url text,
  verified boolean not null default false,
  verification_code text,
  verification_expires bigint,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.branches (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id text references public.users(id) on delete set null,
  customer_email text,
  status text not null default 'Pending',
  total_amount_ugx bigint not null default 0,
  created_at timestamptz not null default now(),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id text primary key,
  actor_user_id text,
  actor_email text,
  actor_role text,
  action text not null,
  entity_type text,
  entity_id text,
  details_json jsonb,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_audit_created_at on public.audit_logs(created_at desc);
