# Supabase SQL

Run these files, in order, in the Supabase project's SQL editor (Dashboard → SQL Editor → New query):

1. `001_schema.sql` — creates all tables (categories, products, profiles, addresses, carts, cart_items, orders, order_items).
2. `002_triggers.sql` — `updated_at` maintenance + auto-creates a `profiles` row and an empty `carts` row whenever a new user signs up.
3. `003_policies.sql` — enables Row Level Security and the per-user access policies the app relies on.
4. `004_seed.sql` — inserts demo categories/products so the storefront has something to show.
5. `005_grants.sql` — grants the `anon`/`authenticated` roles baseline table access. **Required** — without this you'll see `permission denied for table products` (Postgres error `42501`) even though the RLS policies look correct, because RLS only restricts rows and doesn't substitute for a table-level GRANT.
6. `006_confirm_existing_users.sql` — one-time fix for accounts created while "Confirm email" was still enabled (see below); re-run any time you see "Email not confirmed" for an existing account.

> **Email confirmation**: this app doesn't require a confirmation step, so also disable it in Authentication → Providers → Email → turn off "Confirm email" in the Supabase dashboard (not controllable via SQL). Do this once, then run `006_confirm_existing_users.sql` to unblock any accounts created before you disabled it.

To add your own catalog data later, follow the pattern in `004_seed.sql`: insert into `categories` first, then insert into `products` joining on the category `slug`.
