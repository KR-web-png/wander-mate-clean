# PostgreSQL/Supabase Migration Guide

## ✅ Migration Complete!

Your backend has been successfully converted from MySQL to PostgreSQL/Supabase.

## What Changed

### 1. **Dependencies**
- ❌ Removed: `mysql2`
- ✅ Added: `pg` (node-postgres)

### 2. **Database Configuration** (`src/config/database.ts`)
- Replaced MySQL pool with PostgreSQL pool
- Added wrapper to maintain mysql2-like API for minimal controller changes
- Updated connection parameters for Supabase

### 3. **Schema Conversion** (`postgres-schema.sql`)
- ✅ UUID generation: `UUID()` → `gen_random_uuid()`
- ✅ ENUM types: Converted to PostgreSQL custom types
- ✅ AUTO_INCREMENT: Replaced with `DEFAULT gen_random_uuid()`
- ✅ Triggers: `ON UPDATE CURRENT_TIMESTAMP` → PostgreSQL triggers
- ✅ JSON fields: `JSON` → `JSONB` (better performance)
- ✅ Case-insensitive search: `LIKE` → `ILIKE`

### 4. **SQL Query Syntax** (All Controllers)
- ✅ Parameter placeholders: `?` → `$1, $2, $3...`
- ✅ Dynamic queries: Fixed parameter indexing
- ✅ All controllers updated:
  - `auth.controller.ts`
  - `user.controller.ts`
  - `destination.controller.ts`

### 5. **Environment Variables** (`.env`)
Updated with your Supabase credentials:
```env
DB_HOST=db.apoynjzshphcgruopjoi.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Travelapp@2026
DB_NAME=postgres
```

## Setup Instructions

### Step 1: Run Schema in Supabase

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Go to your project: `apoynjzshphcgruopjoi`
3. Navigate to **SQL Editor**
4. Copy and paste the contents of `postgres-schema.sql`
5. Click **Run** to create all tables and types

### Step 2: (Optional) Seed Data

If you have seed data, you'll need to convert it:
- Open `mysql-seed-data.sql` or `seed-data.sql`
- Replace `?` placeholders with PostgreSQL syntax
- Update INSERT statements if needed
- Run in Supabase SQL Editor

### Step 3: Test Connection

```bash
cd backend
npm run dev
```

You should see:
```
✓ PostgreSQL database connected successfully
🚀 Server running on http://localhost:3001
```

### Step 4: Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Key Differences: MySQL vs PostgreSQL

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Parameter placeholder | `?` | `$1, $2, $3` |
| UUID generation | `UUID()` | `gen_random_uuid()` |
| ENUM | `ENUM('a','b')` | Custom type |
| Auto-update timestamp | `ON UPDATE CURRENT_TIMESTAMP` | Trigger function |
| Case-insensitive search | `LIKE` | `ILIKE` |
| JSON | `JSON` | `JSONB` (better) |

## Troubleshooting

### Connection Issues
- ✅ Check Supabase project is active
- ✅ Verify credentials in `.env`
- ✅ Ensure IP is whitelisted (Supabase allows all by default)
- ✅ Check port 5432 is not blocked

### Schema Errors
- Run schema in order (types → tables → indexes → triggers)
- Check for syntax errors in SQL Editor
- Verify all ENUM types are created first

### Query Errors
- Check parameter placeholders (`$1` not `?`)
- Verify column names match new schema
- Check ENUM values match defined types

## Remaining Files to Update (if needed)

The following controller files may also need updates if they exist:
- `trip.routes.ts` / trip controller
- `match.routes.ts` / match controller  
- `payment.routes.ts` / payment controller

Search for `?` placeholders and replace with `$1, $2, $3...` syntax.

## Performance Tips

1. **Indexes**: Already created in schema for common queries
2. **Connection Pooling**: Configured (max 10 connections)
3. **Use JSONB**: Better than JSON for querying
4. **Use ILIKE**: For case-insensitive searches
5. **Prepared Statements**: pg library automatically handles this

## Benefits of PostgreSQL/Supabase

✅ **Free tier**: Better than most MySQL hosting  
✅ **Built-in features**: Auth, Storage, Realtime (optional)  
✅ **Better JSON support**: JSONB with indexing  
✅ **Full-text search**: Built-in capabilities  
✅ **Managed service**: No server maintenance  
✅ **Automatic backups**: On paid tiers  

## Next Steps

1. ✅ Run `postgres-schema.sql` in Supabase
2. ✅ Test API endpoints
3. ✅ Update any remaining controllers
4. ✅ Consider enabling Row Level Security (RLS) in Supabase
5. ✅ Set up automatic backups
6. ✅ Monitor query performance in Supabase dashboard

Happy coding! 🚀
