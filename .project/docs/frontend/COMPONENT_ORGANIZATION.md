# Component Organization

## 🔍 Overview

The Viewzenix frontend implements a domain-based component architecture that organizes UI components according to business domains rather than technical function. This approach enhances maintainability, promotes business domain understanding, and facilitates scalability as the application grows.

## 🏗️ Directory Structure

![Component Organization](./images/component-organization-diagram.png)

```
frontend/
├── components/
│   ├── auth/              # Authentication components
│   ├── common/            # Shared UI components
│   │   ├── errors/        # Error handling components
│   │   └── ui/            # Reusable UI elements
│   ├── layout/            # Layout components
│   └── features/          # Domain-specific components
│       ├── webhook/       # Webhook configuration components
│       ├── trading/       # Trading-related components
│       └── analytics/     # Analytics and reporting components
```

## 🧩 Component Categories

### Auth Components

Authentication and authorization-related components:

- Login and registration forms
- Password reset/recovery
- Role-based access guards
- Permission-based component protection

```tsx
// RoleBasedGuard.tsx
export const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { hasRole } = usePermissions();
  
  if (!hasRole(allowedRoles)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
};
```

### Common Components

Shared UI elements used across multiple features:

- **UI Elements**: Buttons, forms, inputs, modals, etc.
- **Error Components**: Error boundaries, fallbacks, etc.
- **Feedback Components**: Loading indicators, notifications, etc.
- **Data Display**: Tables, cards, lists, etc.

### Layout Components

Components that define the application structure:

- Page layouts (main, dashboard, auth)
- Navigation (sidebar, navbar, breadcrumbs)
- Footer and header components
- Responsive containers and grids

### Feature Components

Domain-specific components organized by business function:

- **Webhook Components**: Configuration forms, status indicators, lists
- **Trading Components**: Order forms, position displays, history views
- **Analytics Components**: Charts, data visualization, reports

## 🧪 Component Structure

### Simple Component

```
ComponentName.tsx               # Component implementation
```

### Complex Component

```
ComponentName/                  # Component directory
├── ComponentName.tsx           # Main component
├── ComponentName.module.css    # Component-specific styles
├── ComponentName.test.tsx      # Component tests
├── SubComponent.tsx            # Related subcomponents
├── utils.ts                    # Component-specific utilities
└── index.ts                    # Barrel export
```

## 🔄 Component Design Principles

### 1. Domain-Driven Design

Components are organized based on business domains rather than technical function:

- Components related to webhooks are in `features/webhook/`
- Components related to trading are in `features/trading/`
- Components related to analytics are in `features/analytics/`

This organization facilitates:
- Domain understanding for developers
- Business context awareness
- Feature-based development and ownership

### 2. Single Responsibility

Each component should have a single responsibility:

- Complex components are broken down into smaller, focused components
- Business logic is extracted into hooks and services
- Presentational and container components are separated when appropriate

### 3. Reusability

Components are designed for reuse:

- Common UI elements are abstracted into shared components
- Components accept props for customization
- Business logic is separated from presentation

### 4. Composition

Component composition is preferred over inheritance:

- Complex UIs are built by composing smaller components
- Higher-order components and render props are used for cross-cutting concerns
- Context is used for shared state across component trees

## 🛠️ Implementation Practices

### Barrel Files

Barrel files (index.ts) simplify imports by re-exporting components:

```typescript
// components/features/webhook/index.ts
export * from './WebhookList';
export * from './WebhookCard';
export * from './WebhookForm';
```

This allows importing multiple components with a single import:

```typescript
import { WebhookList, WebhookCard } from '@/components/features/webhook';
```

### Component Testing

Each component should have associated tests:

- Unit tests for isolated functionality
- Integration tests for component interaction
- Accessibility tests for UI components

### TypeScript Typing

All components use strong TypeScript typing:

- Props interfaces for component inputs
- Return type annotations for functions
- Generic types for reusable components

## 📚 Further Details

For detailed implementation guidelines, naming conventions, and code examples, refer to the comprehensive [Component Structure Guidelines](../../frontend/docs/COMPONENT_STRUCTURE.md) in the frontend documentation.