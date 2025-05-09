# Database Migrations

This directory contains the database migration scripts for the Viewzenix platform.

## Migration Commands

Initialize the migration repository:
```
flask db init
```

Create a new migration after model changes:
```
flask db migrate -m "Description of changes"
```

Apply migrations to the database:
```
flask db upgrade
```

Roll back the last migration:
```
flask db downgrade
```

## Migration Structure

After running `flask db init`, this directory will contain:
- `versions/`: Contains individual migration scripts
- `alembic.ini`: Alembic configuration file
- `env.py`: Environment configuration
- `script.py.mako`: Migration script template

## Workflow

1. Make changes to your SQLAlchemy models
2. Run `flask db migrate -m "Description of changes"` to generate a migration script
3. Review the generated migration script in `versions/`
4. Run `flask db upgrade` to apply the migration to the database

For more information, see the [Flask-Migrate documentation](https://flask-migrate.readthedocs.io/).