-- Migration for Story 3.2: Add application settings to user_profiles
--
-- Adds a JSONB column 'app_settings' to the 'public.user_profiles' table
-- with a default value to store user-specific application preferences.
--
ALTER TABLE public.user_profiles
ADD COLUMN app_settings JSONB DEFAULT '{"dark_mode": false, "notifications_enabled": true}';

-- Note: The default value is only applied to new rows. For existing rows,
-- you may want to run an update statement to populate the initial values.
--
-- UPDATE public.user_profiles
-- SET app_settings = '{"dark_mode": false, "notifications_enabled": true}'
-- WHERE app_settings IS NULL;
