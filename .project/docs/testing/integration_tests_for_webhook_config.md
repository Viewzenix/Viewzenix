# Integration Tests for WebhookConfig Endpoints

**Location:** `backend/tests/integration/test_webhook_config_flow.py`

## Summary
This file contains an end-to-end integration test that verifies the full CRUD lifecycle and toggle functionality for webhook configurations using the Flask test client and an in-memory SQLite database.

## Test Flow
1. **GET** `/webhooks` returns an empty list on a fresh database.
2. **POST** `/webhooks` creates a new configuration and returns its string UUID.
3. **GET** `/webhooks/{id}` retrieves the created configuration.
4. **PUT** `/webhooks/{id}` updates the configuration's `name` field.
5. **PATCH** `/webhooks/{id}/toggle` toggles `isActive` off and then on.
6. **DELETE** `/webhooks/{id}` deletes the configuration.
7. **GET** `/webhooks/{id}` returns `404 NOT_FOUND` for the deleted ID.

## Previous Changes
- Migrated `WebhookConfig.id` to use database-agnostic `Uuid(as_uuid=False, native_uuid=True)` type.
- Updated JSON storage to generic `JSON` type in the model.
- Refactored controllers to accept string IDs (`<string:id>`) instead of UUID objects.
- Updated existing unit tests to work with string UUIDs.

## Next Steps
- Run CI to ensure integration tests pass alongside unit tests.
- Create Alembic migrations for production databases to handle type changes.
- Review and possibly implement a custom GUID TypeDecorator for unified JSONB handling in Postgres.
