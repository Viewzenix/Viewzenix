# Layout Components

This directory contains the main layout components for the Viewzenix application.

## Components

### MainLayout

The primary layout component that wraps all protected pages. It includes a responsive sidebar and handles the layout's collapsed/expanded state.

**Usage:**
```tsx
<MainLayout>
  <YourPageContent />
</MainLayout>
```

### Sidebar

The navigation sidebar component with support for collapsed/expanded states and mobile responsiveness.

**Props:**
- `isCollapsed`: Boolean indicating if the sidebar is in collapsed state
- `onToggleCollapse`: Function to toggle the collapsed state

### NavigationItem

A navigation link item used within the sidebar.

**Props:**
- `icon`: Icon component to display
- `title`: Title of the navigation item
- `path`: Path to navigate to
- `isCollapsed`: Whether the sidebar is collapsed

### Logo

The application logo/branding component.

**Props:**
- `isCollapsed`: Optional boolean to adjust logo display in collapsed state

### ColorModeToggle

Toggle button for switching between light and dark mode.

## Features

- Responsive design for desktop and mobile
- Collapsible sidebar with persistent state (saved to localStorage)
- Dark/light mode toggle
- Active state for current navigation item
- Mobile drawer navigation
- Smooth transitions for all state changes

## Implementation Details

The layout system uses Chakra UI's responsive utilities and components. The sidebar can be collapsed to save space on smaller screens, and on mobile devices, it transforms into a drawer that can be toggled with a hamburger menu.

The navigation state (collapsed/expanded) is persisted in localStorage to maintain user preference across sessions.