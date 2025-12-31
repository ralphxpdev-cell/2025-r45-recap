# Supabase Setup Guide

Complete step-by-step guide for setting up the database for the Auto-Tagging Task System.

## 📋 Prerequisites

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Wait for your project to finish setting up

## 🗄️ Step 1: Run the SQL Migration

### Option A: Using the SQL Editor (Recommended)

1. **Navigate to SQL Editor**
   - In your Supabase dashboard, click on "SQL Editor" in the left sidebar

2. **Create a new query**
   - Click "+ New Query"

3. **Copy the migration SQL**
   - Open `supabase/migrations/001_init_schema.sql`
   - Copy the **entire contents** of the file

4. **Paste and execute**
   - Paste the SQL into the query editor
   - Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)

5. **Verify success**
   - You should see "Success. No rows returned" (this is expected!)
   - Check the "Table Editor" sidebar to confirm these tables were created:
     - `tasks`
     - `auto_tags`
     - `insights`

### Option B: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## 🔑 Step 2: Get Your API Credentials

1. **Navigate to Project Settings**
   - Click the gear icon (⚙️) in the sidebar
   - Go to "API" section

2. **Copy your credentials**
   - **Project URL** - Copy this (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** - Copy this (starts with `eyJ...`)

3. **Add to your `.env` file**
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```

## 🔐 Step 3: Verify Row Level Security

The migration automatically sets up Row Level Security (RLS). To verify:

1. **Go to Authentication > Policies**
2. **Check that policies exist for:**
   - `tasks` table (4 policies: select, insert, update, delete)
   - `auto_tags` table (2 policies)
   - `insights` table (2 policies)

3. **Policy summary:**
   - Users can only access their own data
   - Service role has full access for auto-tagging operations

## 🧪 Step 4: Test the Setup

### Option 1: Using the Table Editor

1. **Go to Table Editor**
2. **Select the `tasks` table**
3. **Try to view the columns:**
   - `id` (uuid)
   - `user_id` (uuid)
   - `title` (text)
   - `description` (text)
   - `completed` (boolean)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - `completed_at` (timestamp)

### Option 2: Using SQL

Run this test query in the SQL Editor:

```sql
-- Test: Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('tasks', 'auto_tags', 'insights');

-- Should return 3 rows
```

## 📊 Understanding the Schema

### Tasks Table
Stores user tasks without any manual categorization.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

### Auto Tags Table
Stores automatically analyzed hidden tags (never shown in UI).

```sql
CREATE TABLE auto_tags (
    id UUID PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES tasks(id),
    action_domain TEXT,      -- work_project, health_wellness, etc.
    energy_type TEXT,        -- deep_focus, light_activity, etc.
    time_weight TEXT,        -- quick_win, deep_work, etc.
    confidence_score DECIMAL(3,2),
    analysis_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Insights Table
Stores natural language summaries of patterns.

```sql
CREATE TABLE insights (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    insight_text TEXT NOT NULL,
    insight_type TEXT,
    supporting_data JSONB,
    viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
);
```

## 🔧 Troubleshooting

### Error: "relation already exists"

**Cause:** You've already run the migration.

**Solution:** Either:
- Drop the existing tables and re-run (careful: this deletes data!)
- Skip this error if tables already exist correctly

### Error: "permission denied"

**Cause:** RLS is blocking your query.

**Solution:**
- Make sure you're authenticated in your app
- Service role operations happen via the backend/Edge Functions

### Can't see my data in Table Editor

**Cause:** RLS policies are working correctly!

**Solution:**
- This is expected - users can only see their own data
- To view all data as admin, temporarily disable RLS (not recommended for production)

### How do I reset the database?

```sql
-- WARNING: This deletes ALL data!
DROP TABLE IF EXISTS insights CASCADE;
DROP TABLE IF EXISTS auto_tags CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;

-- Then re-run the migration
```

## 🚀 Next Steps

1. ✅ SQL migration complete
2. ✅ Environment variables configured
3. 📱 Start building the frontend!

```bash
npm run dev
```

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)

## 🆘 Need Help?

- Check [Supabase Discord](https://discord.supabase.com)
- Review the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Open an issue in this repository
