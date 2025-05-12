# Migration & JSON Default Best Practices

## 1. Avoiding Mutable Defaults in SQLAlchemy

**Issue**: Using a mutable object as a default (e.g., `default={...}`) can lead to shared state across instances.

**Best Practice**:
- Use a callable for the default value:
  ```python
  notification_preferences = Column(
      JSON,
      nullable=False,
      default=lambda: {
          "email": True,
          "browser": True,
          "onSuccess": True,
          "onFailure": True
      }
  )
  ```
- This ensures each new record gets its own fresh object.

## 2. Altering Column Defaults via Alembic

**Strategy**:
1. **Generate a revision**:
   ```bash
   alembic revision -m "Alter notification_preferences default"
   ```
2. **Edit the revision file** (`versions/XXXXXXXXX_alter_notification_default.py`):
   ```python
   from alembic import op
   import sqlalchemy as sa

   def upgrade():
       op.alter_column(
           'webhook_configs',
           'notification_preferences',
           existing_type=sa.JSON(),
           server_default=sa.text("'{\"email\": true, \"browser\": true, \"onSuccess\": true, \"onFailure\": true}'"),
           existing_nullable=False
       )

   def downgrade():
       op.alter_column(
           'webhook_configs',
           'notification_preferences',
           existing_type=sa.JSON(),
           server_default=None,
           existing_nullable=False
       )
   ```
3. **Apply migration**:
   ```bash
   alembic upgrade head
   ```

> Note: The `server_default` syntax may vary by dialect. Test migrations on both SQLite and Postgres.

## 3. Cross-Dialect JSON Defaults

- SQLAlchemy’s `JSON` type automatically maps to:
  - `JSONB` in Postgres
  - `JSON` extension in newer SQLite versions
  - Text-based storage in older SQLite

**Technique**:
- Always use `from sqlalchemy import JSON` for model definitions.
- Avoid dialect-specific JSON types in models (e.g., `postgresql.JSONB`).
- For JSON defaults, use Python-level defaults (callables) rather than database server defaults when consistency is critical.

---
*Document created to guide developers on safe JSON defaults and migration practices.*