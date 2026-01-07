# Supabase Email Confirmation Fix

If signup/login is not working, it's likely because email confirmation is enabled.

## Quick Fix - Disable Email Confirmation (for testing):

1. Go to: https://supabase.com/dashboard/project/apoynjzshphcgruopjoi/auth/providers
2. Scroll to "Email Auth"
3. **Uncheck** "Enable email confirmations"
4. Click Save

Now users can signup and login immediately without email verification.

## For Production:
- Re-enable email confirmations
- Set up email templates in Supabase
- Update signup flow to show "Check your email" message
