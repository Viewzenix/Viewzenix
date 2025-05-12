# Repository Pattern

## 🔍 Overview

The repository pattern is a key architectural component of the Viewzenix frontend, providing a clean separation between data access logic and business logic. This allows for flexibility in data sources, easier testing, and a more maintainable codebase.

## 🏗️ Architecture

![Repository Pattern](./images/repository-pattern-diagram.png)

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Components     │      │  Repository     │      │  Data Sources   │
│  Hooks/Services │<────>│  Interfaces     │<────>│  (Supabase,     │
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

## 🧩 Key Components

### 1. Repository Interfaces

Repository interfaces define the contract for data access operations, ensuring consistency regardless of the implementation. Each domain (webhooks, trades, orders, users) has its own repository interface.

```typescript
// Base repository interface
interface BaseRepository<T, ID> {
  findAll(): Promise<RepositoryResult<T[]>>;
  findById(id: ID): Promise<RepositoryResult<T>>;
  create(data: any): Promise<RepositoryResult<T>>;
  update(id: ID, data: any): Promise<RepositoryResult<T>>;
  delete(id: ID): Promise<RepositoryVoidResult>;
}

// Domain-specific repository interface
interface WebhookRepository extends BaseRepository<WebhookConfig, string> {
  findAllForCurrentUser(): Promise<RepositoryResult<WebhookConfig[]>>;
  toggleStatus(id: string, isActive: boolean): Promise<RepositoryResult<WebhookConfig>>;
}
```

### 2. Repository Implementations

Each repository interface has multiple concrete implementations for different data sources:

- **Supabase**: Primary implementation using Supabase for authenticated users
- **REST API**: Alternative implementation using direct API calls
- **LocalStorage**: Fallback implementation for offline support

This flexibility allows the application to work with different backends or even in offline mode.

### 3. Repository Factory

The factory pattern creates repository instances, handling the selection of the appropriate implementation and providing fallback options:

```typescript
// Repository factory interface
interface RepositoryFactory<T> {
  create(options?: RepositoryOptions): T;
}

// Domain-specific factory
class WebhookRepositoryFactory implements RepositoryFactory<WebhookRepository> {
  create(options?: RepositoryOptions): WebhookRepository {
    // Choose implementation based on options, availability, and user state
  }
}
```

### 4. Repository Results

Repository operations return standardized result objects with success/error information:

```typescript
interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: RepositoryError;
}

interface RepositoryVoidResult {
  success: boolean;
  error?: RepositoryError;
}
```

## 🛠️ Implementation

The repository pattern is implemented in the `repositories/` directory with the following structure:

```
repositories/
  ├── interfaces/                  # Repository interfaces
  │   ├── base.repository.ts       # Base repository interface
  │   ├── webhook.repository.ts    # WebhookRepository interface
  │   ├── user.repository.ts       # UserRepository interface
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

## 🔄 Data Flow

A typical data flow using the repository pattern:

1. **Component/Hook**: Requests data through a repository interface
2. **Repository Factory**: Creates the appropriate repository implementation
3. **Repository Implementation**: Executes the data operation
4. **Return Result**: Standardized result with success/error information
5. **Component/Hook**: Processes the result and updates UI

## 📈 Benefits

The repository pattern provides several architectural benefits:

- **Abstraction**: Data source details are hidden from business logic
- **Flexibility**: Multiple implementations can be swapped without changing business logic
- **Testability**: Easy to mock repositories for testing
- **Fallback**: Graceful degradation with fallback implementations
- **Standardization**: Consistent error handling and result formatting
- **Type Safety**: Strong typing throughout the data access layer

## 🔄 Fallback Mechanism

The repository pattern implements a sophisticated fallback mechanism:

1. Try the preferred repository implementation (typically Supabase)
2. If it fails, try the next implementation in the fallback chain (REST API)
3. If all online options fail, use the localStorage implementation

This ensures the application remains functional even with connectivity issues.

## 🛠️ Customization Options

Repositories can be customized with options:

```typescript
interface RepositoryOptions {
  preferredType?: RepositoryType;  // SUPABASE, REST, LOCAL_STORAGE
  useFallback?: boolean;           // Whether to use fallback mechanism
  cacheTime?: number;              // Cache duration in milliseconds
  retryCount?: number;             // Number of retry attempts
}
```

## 📚 Further Details

For detailed implementation guidelines and examples, refer to the comprehensive [Repository Pattern Implementation Guide](../../frontend/docs/REPOSITORY_PATTERN.md) in the frontend documentation.