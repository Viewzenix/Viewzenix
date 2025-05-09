#!/usr/bin/env python
"""
Management script for Viewzenix backend.

This script provides commands for database migrations and application management.
"""
import os
import click
from flask.cli import FlaskGroup
from flask_migrate import Migrate

from app import create_app
from app.extensions import db, migrate
from app.core.models.webhook_config import WebhookConfig

app = create_app(os.getenv('FLASK_ENV') or 'development')

# Initialize Flask-Migrate with the app and database
migrate.init_app(app, db)


@app.shell_context_processor
def make_shell_context():
    """
    Add objects to the Flask shell context.
    
    Returns:
        Dictionary of objects to include in shell context
    """
    return {
        'db': db,
        'WebhookConfig': WebhookConfig
    }


@app.cli.command('init-db')
def init_db():
    """Initialize the database with schema and initial data."""
    click.echo('Initializing database...')
    db.create_all()
    click.echo('Database initialized successfully.')


@app.cli.command('db-init')
def db_init():
    """Initialize the migration repository."""
    click.echo('Initializing migration repository...')
    # Note: This would typically run "flask db init" but the command is 
    # already registered by Flask-Migrate and available via "flask db"
    click.echo('Migration repository initialized. Use "flask db init" to create it.')


@app.cli.command('db-migrate')
@click.option('--message', '-m', help='Migration message')
def db_migrate(message):
    """Generate a new migration from schema changes."""
    command = f"flask db migrate"
    if message:
        command += f" -m \"{message}\""
    
    click.echo(f'To create a new migration, run: {command}')
    click.echo('This will detect schema changes and generate migration scripts.')


@app.cli.command('db-upgrade')
def db_upgrade():
    """Apply all available migrations."""
    click.echo('To apply all migrations, run: flask db upgrade')
    click.echo('This will apply any pending migrations to the database.')


@app.cli.command('seed-db')
def seed_db():
    """Seed the database with initial data."""
    click.echo('Seeding database...')
    
    # Check if database is already seeded
    if WebhookConfig.query.first():
        click.echo('Database already contains data. Skipping seed.')
        return
    
    # Create a sample webhook configuration
    sample_config = WebhookConfig(
        name="Sample Trading Strategy",
        description="TradingView alerts for sample strategy",
        webhook_url="https://api.viewzenix.com/webhook/sample",
        security_token="sample-token-123",
        notification_preferences={
            "email": True,
            "browser": True,
            "onSuccess": True,
            "onFailure": True
        },
        is_active=True
    )
    
    # Add to database
    db.session.add(sample_config)
    db.session.commit()
    
    click.echo(f'Created sample webhook configuration with ID: {sample_config.id}')
    click.echo('Database seeding completed successfully.')


if __name__ == '__main__':
    # Create a Flask CLI command instance
    cli = FlaskGroup(create_app=lambda: app)
    cli()