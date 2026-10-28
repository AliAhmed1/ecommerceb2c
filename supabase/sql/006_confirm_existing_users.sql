-- One-time fix: run this AFTER disabling "Confirm email" in
-- Authentication -> Providers -> Email in the Supabase dashboard.
--
-- Accounts created while email confirmation was required are stuck with
-- email_confirmed_at = null and can't sign in ("Email not confirmed").
-- This marks all such existing users as confirmed so they can log in.
-- Safe to re-run; only affects rows that aren't already confirmed.

update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;
