# Repository Pattern Implementation Guide

## Overview

The repository pattern is a design pattern that abstracts the data access layer from the rest of the application. It provides a clean separation of concerns and makes the code more testable, maintainable, and adaptable to changes in the data source.

This guide explains how the repository pattern is implemented in the Viewzenix frontend.

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Application    │<────>│  Repository     │<────>│  Data Sources   │
│  Services       │      │  Layer          │      │  (Supabase,     │
│                 │      │                 │      │   REST, etc.)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                               │  
                               ▼  
                         ┌─────────────────┐
                         │                 │
                         │  Repository     │
                         │  Factory        │
                         │                 │
                         └─────────────────┘
```

## Key Components

### 1. Repository Interfaces

Repository interfaces define the contract for data access. Each domain has its own repository interface that extends the base repository interface.

```typescript
// Base repository interface with common CRUD operations
interface BaseRepository<T, ID> {
  findAll(): Promise<RepositoryResult<T[]>>;
  findById(id: ID): Promise<RepositoryResult<T>>;
  create(data: any): Promise<RepositoryResult<T>>;
  update(id: ID, data: any): Promise<RepositoryResult<T>>;
  delete(id: ID): Promise<RepositoryVoidResult>;
  // ...
}

// Domain-specific repository interface
interface WebhookRepository extends BaseRepository<WebhookConfig, string> {
  findAllForCurrentUser(): Promise<RepositoryResult<WebhookConfig[]>>;
  toggleStatus(id: string, data: ToggleWebhookStatusDto): Promise<RepositoryResult<WebhookConfig>>;
  // ...
}
```

### 2. Repository Implementations

Each repository interface has multiple implementations, one for each data source (Supabase, REST API, localStorage).

```typescript
// Implementation for localStorage
class LocalStorageWebhookRepository implements WebhookRepository {
  async findAll(): Promise<RepositoryResult<WebhookConfig[]>> {
    // Implementation for localStorage
  }
  
  async create(data: CreateWebhookConfigDto): Promise<RepositoryResult<WebhookConfig>> {
    // Implementation for localStorage
  }
  
  // ...
}

// Implementation for Supabase
class SupabaseWebhookRepository implements WebhookRepository {
  async findAll(): Promise<RepositoryResult<WebhookConfig[]>> {
    // Implementation for Supabase
  }
  
  // ...
}
```

### 3. Repository Factory

The factory pattern is used to create repository instances. It handles the creation of repositories and provides fallback mechanisms.

```typescript
// Factory for creating repository instances
class WebhookRepositoryFactory {
  // Get repository instance
  create(options?: RepositoryOptions): WebhookRepository {
    // Choose the appropriate repository implementation
    // based on options and availability
  }
}
```

### 4. Helper Functions

Helper functions provide a convenient way to get repositories without directly interacting with factories.

```typescript
// Helper function to get a webhook repository
function getWebhookRepository(): WebhookRepository {
  return WebhookRepositoryFactory.getInstance().create();
}
```

## Repository Fallback Mechanism

The repository pattern implements a fallback mechanism to ensure data access even if the primary data source is unavailable:

1. Try to use the preferred repository type (e.g., Supabase)
2. If it fails, try the next repository in the fallback order (e.g., REST API)
3. If all else fails, use localStorage as a last resort

This ensures that the application can still function even if there are connectivity issues.

## Usage Examples

### Basic Usage

```typescript
import { getWebhookRepository } from '@/repositories';

async function fetchWebhooks() {
  const webhookRepository = getWebhookRepository();
  const result = await webhookRepository.findAllForCurrentUser();
  
  if (result.success) {
    return result.data;
  } else {
    console.error('Failed to fetch webhooks:', result.error);
    return [];
  }
}
```

### With Custom Options

```typescript
import { WebhookRepositoryFactory } from '@/repositories/factories';
import { RepositoryType } from '@/types/repository/repository.types';

async function fetchWebhooks() {
  const repository = WebhookRepositoryFactory.getInstance().create({
    preferredType: RepositoryType.REST,
    useFallback: true,
  });
  
  const result = await repository.findAllForCurrentUser();
  // ...
}
```

## Best Practices

1. **Always handle errors**: Check `result.success` before using `result.data`
2. **Use the helper functions**: Use `getWebhookRepository()` instead of directly creating repositories
3. **Don't mix repository types**: Stick to one repository type per service to ensure consistent behavior
4. **Use repository health checks**: Check if repositories are available before using them

## Repository Structure

```
repositories/
  ├── interfaces/                  # Repository interfaces
  │   ├── base.repository.ts       # Base repository interface
  │   ├── webhook.repository.ts    # WebhookRepository interface
  │   └── ...
  │
  ├── implementations/             # Repository implementations
  │   ├── supabase/                # Supabase implementations
  │   ├── rest/                    # REST API implementations
  │   └── local-storage/           # localStorage implementations
  │
  ├── factories/                   # Factory implementations
  │   ├── repository.factory.ts    # Base factory
  │   ├── webhook.factory.ts       # WebhookRepository factory
  │   └── ...
  │
  └── index.ts                     # Main exports
```