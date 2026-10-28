-- Run after 002_triggers.sql.
-- Enables Row Level Security and the policies the app relies on.
-- Catalog tables (categories/products) are publicly readable; everything
-- else is scoped to auth.uid(). There are intentionally no insert/update
-- policies on products/categories: manage the catalog via SQL (see
-- 004_seed.sql) or the Supabase dashboard using the service role key.

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories
  for select using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products
  for select using (true);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can view own addresses" on public.addresses;
create policy "Users can view own addresses" on public.addresses
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own addresses" on public.addresses;
create policy "Users can insert own addresses" on public.addresses
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own addresses" on public.addresses;
create policy "Users can update own addresses" on public.addresses
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own addresses" on public.addresses;
create policy "Users can delete own addresses" on public.addresses
  for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own cart" on public.carts;
create policy "Users can view own cart" on public.carts
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own cart" on public.carts;
create policy "Users can insert own cart" on public.carts
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own cart" on public.carts;
create policy "Users can update own cart" on public.carts
  for update using (auth.uid() = user_id);

drop policy if exists "Users can view own cart items" on public.cart_items;
create policy "Users can view own cart items" on public.cart_items
  for select using (
    cart_id in (select id from public.carts where user_id = auth.uid())
  );

drop policy if exists "Users can insert own cart items" on public.cart_items;
create policy "Users can insert own cart items" on public.cart_items
  for insert with check (
    cart_id in (select id from public.carts where user_id = auth.uid())
  );

drop policy if exists "Users can update own cart items" on public.cart_items;
create policy "Users can update own cart items" on public.cart_items
  for update using (
    cart_id in (select id from public.carts where user_id = auth.uid())
  );

drop policy if exists "Users can delete own cart items" on public.cart_items;
create policy "Users can delete own cart items" on public.cart_items
  for delete using (
    cart_id in (select id from public.carts where user_id = auth.uid())
  );

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items" on public.order_items
  for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );

drop policy if exists "Users can insert own order items" on public.order_items;
create policy "Users can insert own order items" on public.order_items
  for insert with check (
    order_id in (select id from public.orders where user_id = auth.uid())
  );
