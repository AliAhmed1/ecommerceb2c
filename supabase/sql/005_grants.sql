-- Run after 003_policies.sql (or any time you hit "permission denied for
-- table ..." / Postgres error 42501).
--
-- RLS policies only control *row* visibility; the anon/authenticated roles
-- also need a baseline table-level GRANT before Postgres will even consider
-- a policy. Some Supabase projects don't pre-grant these for tables created
-- via the SQL editor, so they're granted explicitly here.

grant usage on schema public to anon, authenticated;

-- Public catalog: anyone (including signed-out visitors) can read it.
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;

-- Everything below is further restricted by RLS policies to auth.uid().
grant select, update on public.profiles to authenticated;

grant select, insert, update, delete on public.addresses to authenticated;

grant select, insert, update on public.carts to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;

grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
