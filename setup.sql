-- ELVO WOOD V6
-- Run this ONCE in Supabase SQL Editor after the previous setup.

create table if not exists public.product_360_frames (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  frame_index integer not null,
  frame_path text not null,
  created_at timestamptz not null default now(),
  unique(product_id, frame_index)
);

alter table public.product_360_frames enable row level security;

drop policy if exists "Public can view 360 frames for active products" on public.product_360_frames;
create policy "Public can view 360 frames for active products"
on public.product_360_frames
for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.active = true
  )
);

drop policy if exists "Admin can insert 360 frames" on public.product_360_frames;
create policy "Admin can insert 360 frames"
on public.product_360_frames
for insert
to authenticated
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin can update 360 frames" on public.product_360_frames;
create policy "Admin can update 360 frames"
on public.product_360_frames
for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin can delete 360 frames" on public.product_360_frames;
create policy "Admin can delete 360 frames"
on public.product_360_frames
for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Storage read policy is not needed for PUBLIC buckets.
-- Upload/update/delete policies were created in the previous setup.
