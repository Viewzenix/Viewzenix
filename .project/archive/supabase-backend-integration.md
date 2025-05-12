# Supabase Backend Integration

## Overview
This document describes the integration of Supabase into the Viewzenix backend for database management, authentication, and webhook signal processing.

## Supabase Project Details
- **Project ID**: lffpnrdeaddwxxwjidea
- **Organization ID**: qujfiqqujnsaarofcylb
- **Supabase URL**: https://lffpnrdeaddwxxwjidea.supabase.co
- **Anonymous API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZnBucmRlYWRkd3h4d2ppZGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTEwODMsImV4cCI6MjA2MjM4NzA4M30.mAXb1rZkArDEXBDulBIgz03pFLO9NULntZRIyRY_tiI

## Environment Variables
Set the following variables in your environment or in an `.env` file:

```bash
# Flask Application
SECRET_KEY=...
WEBHOOK_PASSPHRASE=...

# Database
DATABASE_URL=...

# Alpaca API
ALPACA_API_KEY=...
ALPACA_API_SECRET=...
ALPACA_API_URL=...

# Order Processing
SIMULATION_MODE=True
DEFAULT_ORDER_QUANTITY=1
POSITION_SIZING_METHOD=fixed
POSITION_SIZE_VALUE=1.0

# Supabase
SUPABASE_URL=https://lffpnrdeaddwxxwjidea.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZnBucmRlYWRkd3h4d2ppZGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTEwODMsImV4cCI6MjA2MjM4NzA4M30.mAXb1rZkArDEXBDulBIgz03pFLO9NULntZRIyRY_tiI
```

## Implementation Plan

### Phase 1: Database Schema & RLS Policies
1. Create `webhook_configs` table in Supabase with fields:
   - `id` UUID primary key (default `uuid_generate_v4()`)
   - `user_id` UUID foreign key referencing `auth.users(id)`
   - `name`, `description`, `webhook_url`, `security_token` (TEXT)
   - `notification_preferences` (JSON)
   - `is_active` (BOOLEAN, default TRUE)
   - `created_at`, `updated_at` (TIMESTAMPTZ)
2. Enable Row-Level Security on the table.
3. Create policies:
   - **Select**: `auth.uid() = user_id`
   - **Insert**: `auth.uid() = user_id`
   - **Update/Delete**: `auth.uid() = user_id`

### Phase 2: Edge Function for Webhook Processing
1. Create Supabase Edge Function `receive-webhook`:
   - Accept unauthenticated POST requests
   - Parse and validate payload
   - Insert or update records in Supabase
   - Optionally forward signals to broker API
2. Deploy function with `supabase functions deploy receive-webhook --no-verify-jwt`

### Phase 3: Flask Backend Updates
1. Install `flask-supabase` extension:
   ```bash
   pip install flask-supabase
   ```
2. Initialize Supabase client in `app/__init__.py`:
   ```python
   from flask_supabase import Supabase
   supabase = Supabase(app)
   ```
3. Update repository code in `webhook_config` routes and core services to use Supabase client instead of SQLAlchemy.
4. Implement JWT validation middleware for Supabase Auth tokens in Flask.

### Phase 4: Broker Integration & Order Processing
1. Adapt `OrderEngine` to read/write order data from/to Supabase.
2. Implement risk management and broker API calls after payload insertion.
3. Store trade results and logs in Supabase tables.

### Phase 5: Testing & Documentation
1. Write unit tests and integration tests using `pytest` and Supabase client.
2. Update API documentation in `.project/docs/specifications/webhook_config.yml` and docs in this guide.
3. Validate security policies and error handling.

## Next Steps
- Apply initial migrations using `mcp_hub apply_migration` tool.
- Deploy edge function and verify endpoint.
- Update Flask backend and run tests.

---
*Document generated on 2025-05-15*