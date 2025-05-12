# Component Structure Guidelines

This document outlines the domain-based component architecture for the Viewzenix frontend application. Following these guidelines ensures consistency, maintainability, and scalability as the application grows.

## Directory Structure

The components in the Viewzenix platform are organized according to the following hierarchy:

```
frontend/
├── components/
│   ├── auth/              # Authentication and authorization components
│   ├── common/            # Shared UI components
│   │   ├── errors/        # Error handling components
│   │   └── ui/            # Reusable UI elements
│   ├── layout/            # Layout components (containers, navbars, etc.)
│   └── features/          # Domain-specific feature components
│       ├── webhook/       # Webhook configuration components
│       ├── trading/       # Trading-related components
│       └── analytics/     # Analytics and reporting components
```

## Domain-Based Component Organization

The component structure follows a domain-driven design approach, where components are organized based on their business domain rather than their technical function. This makes it easier to:

1. Locate components related to a specific feature
2. Understand the business context of each component
3. Maintain clear separation of concerns
4. Scale the application by adding new feature domains

## Component Categories

### Auth Components (`components/auth/`)

Authentication and authorization components including:
- Login/signup forms
- Password reset
- Role-based guards and permission controls
- Authentication status indicators

**Example:** `AuthForms.tsx`, `RoleBasedGuard.tsx`

### Common Components (`components/common/`)

Shared components used across multiple features:
- UI elements like buttons, inputs, modals
- Error handling components
- Loading states
- Utility components

**Example:** `Button.tsx`, `ErrorBoundary.tsx`, `LoadingSpinner.tsx`

### Layout Components (`components/layout/`)

Components responsible for the application structure:
- Page layouts
- Navigation components
- Sidebars
- Headers and footers
- Responsive containers

**Example:** `MainLayout.tsx`, `Sidebar.tsx`, `Navbar.tsx`

### Feature Components (`components/features/`)

Feature-specific components organized by business domain:

#### Webhook Components (`components/features/webhook/`)
- Webhook configuration forms
- Webhook lists and detail views
- Webhook status indicators
- URL generators

#### Trading Components (`components/features/trading/`)
- Order forms
- Position displays
- Trade history views
- Broker connection components

#### Analytics Components (`components/features/analytics/`)
- Performance charts
- Data visualization components
- Reporting tools
- Statistics displays

## Component Structure Guidelines

### Component File Organization

Each component should follow this structure:

1. For simple components:
   ```
   ComponentName.tsx               # Component implementation
   ```

2. For complex components:
   ```
   ComponentName/                  # Component directory
   ├── ComponentName.tsx           # Main component
   ├── ComponentName.module.css    # Component-specific styles
   ├── ComponentName.test.tsx      # Component tests
   ├── SubComponent.tsx            # Related subcomponents
   ├── utils.ts                    # Component-specific utilities
   └── index.ts                    # Barrel export
   ```

### Barrel Exports

Use barrel exports (index.ts files) to simplify imports:

```typescript
// components/auth/index.ts
export * from './AuthForms';
export * from './RoleBasedGuard';
```

This allows importing multiple components from a directory with a single import:

```typescript
import { AuthForm, RoleBasedGuard } from '@/components/auth';
```

## Component Creation Guidelines

### When to Create a New Component

Create a new component when:
- UI element is used in multiple places
- Component is logically distinct
- Component complexity is high
- Code clarity would benefit from separation

### Choosing the Right Location

1. **Is it related to authentication?** → Place in `auth/`
2. **Is it used across multiple features?** → Place in `common/`
3. **Is it part of the application structure?** → Place in `layout/`
4. **Is it specific to a business domain?** → Place in appropriate `features/` subdirectory

### Component Naming Conventions

- Use **PascalCase** for component files and directories
- Use descriptive names that clearly indicate purpose
- Suffix test files with `.test.tsx`
- Suffix CSS modules with `.module.css`

### Component Implementation Guidelines

- Use functional components with hooks
- Implement proper TypeScript typing for props
- Keep components focused on a single responsibility
- Extract complex logic to custom hooks
- Document complex components with JSDoc comments
- Add appropriate data-testid attributes for testing

## Refactoring Existing Components

When refactoring existing components to fit this structure:

1. Identify the appropriate category for the component
2. Create the component in the new location
3. Update all imports throughout the application
4. Remove the old component once all references are updated
5. Update barrel exports to include the new component

## Example: Adding a New Feature Component

To add a new component for the webhook feature:

1. Create the component file:
   ```
   frontend/components/features/webhook/WebhookConfigForm.tsx
   ```

2. Implement the component with proper typing:
   ```tsx
   interface WebhookConfigFormProps {
     // props definition
   }

   export const WebhookConfigForm: React.FC<WebhookConfigFormProps> = (props) => {
     // implementation
   };
   ```

3. Export the component from the barrel file:
   ```typescript
   // frontend/components/features/webhook/index.ts
   export * from './WebhookConfigForm';
   ```

4. Import the component using the barrel:
   ```typescript
   import { WebhookConfigForm } from '@/components/features/webhook';
   ```