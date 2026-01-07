# Supabase Direct Client Setup

Your app now uses Supabase client directly - no need to run the backend server manually!

## Quick Setup (Required)

1. **Get your Supabase keys:**
   - Go to: https://supabase.com/dashboard/project/apoynjzshphcgruopjoi/settings/api
   - Copy the **anon/public** key (NOT the service_role key)

2. **Update `.env` file:**
   ```
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

## What Changed

- ✅ Auth now uses Supabase Auth directly (no backend needed)
- ✅ Data queries go straight to Supabase database
- ✅ Works automatically on mobile devices (no manual server start)
- ✅ Sessions persist across app restarts

## For Mobile Deployment

When building for Android/iOS:

1. Add Supabase keys to your mobile build config:
   - **Expo**: Add to `app.config.js` or use EAS secrets
   - **React Native**: Add to build environment variables

2. Rebuild the app with production keys

3. The app will connect to Supabase automatically - no backend server needed!

## Security Notes

- ✅ ANON key is safe to use in mobile apps (it's public)
- ❌ Never use SERVICE_ROLE key in frontend/mobile code
- ✅ Row Level Security (RLS) policies protect your data
- ✅ Auth tokens are stored securely in localStorage

## Testing

1. Sign up with a new account
2. Check Supabase Dashboard > Authentication > Users to see the new user
3. Check Supabase Dashboard > Table Editor > users table for profile data
