---
id: "TASK-104"
title: "Populate Sidebar with links to the main pages, indicate active page"
status: "backlog" # backlog, todo, in-progress, review, done
priority: "medium" # low, medium, high, critical
assignee: "frontend-agent"
epic: "EPIC-1.3"
phase: "Phase 1"
created: "2024-05-08"
updated: "2024-05-08"
depends_on: ["TASK-101", "TASK-102", "TASK-103"]
tags: ["ui", "react", "navigation"]
---

# Populate Sidebar with links to the main pages, indicate active page

## Description
Implement the navigation menu in the sidebar with links to all main sections of the application, and add visual indication of the currently active page.

## Acceptance Criteria
- [ ] Create a navigation component with links to: Webhook Setup, Brokers, Bots, Logs, Analytics
- [ ] Each navigation item should have an appropriate icon
- [ ] Use the routing system set up in TASK-102 for navigation
- [ ] The currently active page should be visually highlighted
- [ ] Clicking a navigation item should update the URL and display the corresponding page
- [ ] Add hover effects and appropriate visual styling for all states
- [ ] Implement proper keyboard navigation and accessibility

## Technical Details
The navigation component should integrate with the Layout component created in TASK-101:

```tsx
// Navigation.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Navigation.module.css';

// Icons can be from any icon library like react-icons
import { IconWebhook, IconBrokers, IconBots, IconLogs, IconAnalytics } from './Icons';

export function Navigation() {
  const router = useRouter();
  
  // Navigation items with their paths, labels, and icons
  const navItems = [
    { path: '/webhook-setup', label: 'Webhook Setup', icon: <IconWebhook /> },
    { path: '/brokers', label: 'Brokers', icon: <IconBrokers /> },
    { path: '/bots', label: 'Bots', icon: <IconBots /> },
    { path: '/logs', label: 'Logs', icon: <IconLogs /> },
    { path: '/analytics', label: 'Analytics', icon: <IconAnalytics /> },
  ];
  
  return (
    <ul className={styles.navList}>
      {navItems.map((item) => {
        const isActive = router.pathname === item.path;
        return (
          <li key={item.path} className={styles.navItem}>
            <Link href={item.path}>
              <a className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
```

## Dependencies
- TASK-101: Layout component with sidebar structure
- TASK-102: Client-side routing setup
- TASK-103: Placeholder page components for navigation targets

## Notes
Focus on a clean, intuitive navigation design that makes it easy for users to understand where they are in the application and how to get to other sections.

## Updates
- **2024-05-08**: Task created 