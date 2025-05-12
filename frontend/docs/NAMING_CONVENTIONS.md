# Naming Conventions

This document outlines the standardized naming conventions for the Viewzenix frontend codebase to ensure consistency and maintainability.

## TypeScript Files

### Type Definitions

- **Pattern**: `*.types.ts`
- **Example**: `webhook.types.ts`, `auth.types.ts`
- **Usage**: Contains interfaces, types, and enums for a specific domain
- **Location**: `frontend/types/` directory

### Components

- **Pattern**: PascalCase `.tsx`
- **Example**: `WebhookCard.tsx`, `OrderTable.tsx`
- **Usage**: React functional components
- **Location**: `frontend/components/` directory and subdirectories

### Hooks

- **Pattern**: camelCase with `use` prefix `.ts`
- **Example**: `useWebhooks.ts`, `useOrderStatus.ts`
- **Usage**: Custom React hooks
- **Location**: `frontend/hooks/` directory

### Utilities

- **Pattern**: camelCase `.utils.ts`
- **Example**: `date.utils.ts`, `format.utils.ts`
- **Usage**: Utility functions and helpers
- **Location**: `frontend/utils/` directory

### Constants

- **Pattern**: UPPER_SNAKE_CASE for constant values
- **Example**: `API_ENDPOINTS.ts`, `DEFAULT_VALUES.ts`
- **Usage**: Application constants and configuration
- **Location**: Typically within domain-specific directories

### Barrel Files

- **Pattern**: `index.ts`
- **Example**: `types/index.ts`, `components/Button/index.ts`
- **Usage**: Re-exports from a directory to simplify imports
- **Location**: Root of the directory being exported

## CSS/Styling

### CSS Modules

- **Pattern**: Component name with `.module.css` suffix
- **Example**: `Button.module.css`, `Dashboard.module.css`
- **Usage**: Component-specific styles
- **Location**: Same directory as the component

### Global Styles

- **Pattern**: Descriptive camelCase with `.css` suffix
- **Example**: `variables.css`, `typography.css`
- **Usage**: Global style definitions
- **Location**: `frontend/styles/` directory

## Import Conventions

- Always use absolute imports from the app root when importing across directories
- Use relative imports only for files in the same directory
- Use barrel exports/imports where appropriate to reduce import clutter
- Import order: React/external libraries first, then internal modules, then styles

Example:
```typescript
// External imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Internal imports (absolute from app root)
import { WebhookConfig } from 'types';
import { Button } from 'components/common';
import { useWebhooks } from 'hooks';

// Related imports (relative)
import { formatWebhookUrl } from './utils';

// Styles (always last)
import styles from './WebhookCard.module.css';
```

## Documentation

- Use JSDoc comments for all public functions, classes, and interfaces
- Document parameters, return types, and possible exceptions
- Include examples for complex functionality

Example:
```typescript
/**
 * Formats a webhook configuration into a displayable card
 * 
 * @param config - The webhook configuration to format
 * @param options - Display options
 * @returns Formatted webhook data ready for display
 * @throws {ValidationError} If the webhook configuration is invalid
 * 
 * @example
 * const displayData = formatWebhookForCard({
 *   id: '123',
 *   name: 'My Webhook'
 * });
 */
function formatWebhookForCard(config: WebhookConfig, options?: DisplayOptions): FormattedWebhook {
  // Implementation
}
```

## Component Structure

- Each component should be in its own directory if it has related files
- Complex components should be broken down into subcomponents
- Each component directory may include:
  - Main component file (PascalCase.tsx)
  - CSS module (PascalCase.module.css)
  - Tests (PascalCase.test.tsx)
  - Utils (utils.ts)
  - Index file for export (index.ts)

Example structure:
```
components/
  WebhookCard/
    WebhookCard.tsx
    WebhookCard.module.css
    WebhookCard.test.tsx
    utils.ts
    index.ts
```