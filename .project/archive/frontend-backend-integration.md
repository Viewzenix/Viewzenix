# Frontend-Backend Integration Guidelines

## Overview

This document outlines the best practices, current issues, and recommendations for improving the integration between the frontend and backend systems in the Viewzenix trading webhook platform.

## Current Architecture

The Viewzenix platform currently uses:
- **Frontend**: Next.js with Chakra UI v3, TypeScript
- **Backend**: Supabase for authentication and database, with edge functions
- **API Layer**: Custom API client with REST endpoints and Supabase direct access

## Identified Issues

### 1. Critical Issues

#### Table Name Inconsistency
- The Supabase edge function uses `webhook_configs` table
- The frontend services use `webhooks` table
- This inconsistency will cause production failures

#### Security Concerns
- Credentials in version control (.env.local)
- Security tokens stored in localStorage
- Lack of proper CORS and security headers

#### Type Safety Issues
- Extensive use of `any` type in webhook service
- Duplicate type definitions between services

### 2. Architectural Concerns

#### Data Access and Business Logic
- Direct mixing of data access methods in services
- No clear separation of concerns
- Multiple data sources without clear synchronization strategy

#### Error Handling
- Silent failure handling with simple fallbacks
- No centralized error management
- Limited user feedback on errors

#### Environment Configuration
- Hardcoded values instead of environment-specific configuration
- Missing validation for required configuration values

## Recommendations

### 1. Standardize Table Names

```typescript
// Create constants file
export const DB_TABLES = {
  WEBHOOKS: 'webhook_configs', // Match the name used in Supabase function
};

// Use constants throughout the app
const { data } = await supabase.from(DB_TABLES.WEBHOOKS).select('*');
```

### 2. Implement Repository Pattern

```typescript
export interface WebhookRepository {
  getAll(): Promise<WebhookConfig[]>;
  getById(id: string): Promise<WebhookConfig | null>;
  create(data: CreateWebhookConfigData): Promise<WebhookConfig>;
  update(id: string, data: UpdateWebhookConfigData): Promise<WebhookConfig>;
  delete(id: string): Promise<boolean>;
}

// Implementation for Supabase
export class SupabaseWebhookRepository implements WebhookRepository {
  // Type-safe implementations
}
```

### 3. Enhance Error Handling

```typescript
export class ErrorService {
  logError(source: string, error: unknown, context?: Record<string, any>): void {
    console.error(`[${source}]`, error, context);
    // Add monitoring integration
  }
  
  showUserError(message: string, error?: unknown): void {
    // Display toast notification to user
    if (error) this.logError('UserError', error);
  }
}
```

### 4. Environment Configuration

```typescript
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    webhookTable: 'webhook_configs', // Consistent table name
  },
  webhooks: {
    baseUrl: process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL || 'https://api.viewzenix.com/webhook',
  }
};
```

## Implementation Roadmap

### Week 1: Critical Fixes
- Fix table name inconsistency
- Remove credentials from version control
- Implement basic error handling improvements

### Week 2: Architecture Improvements
- Implement repository pattern
- Improve type safety with generated types
- Eliminate `any` types

### Week 3: Enhanced Error Handling and Configuration
- Create centralized error handling service
- Implement environment-specific configuration
- Add logging and monitoring

### Week 4: User Experience and Testing
- Implement centralized state management
- Add data synchronization UI
- Create offline indicators

### Week 5: Testing and Documentation
- Implement contract testing
- Add integration tests
- Complete documentation

## Security Checklist

- [ ] Remove .env.local from git repository
- [ ] Add .env.local to .gitignore
- [ ] Create .env.example template with dummy values
- [ ] Rotate any exposed Supabase keys
- [ ] Store security tokens in HTTP-only cookies instead of localStorage
- [ ] Implement proper CORS configuration
- [ ] Add security headers

## Conclusion

Implementing these recommendations will significantly improve the robustness, maintainability, and security of the Viewzenix platform's frontend-backend integration, providing a solid foundation for future development.