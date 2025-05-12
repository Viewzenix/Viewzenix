---
id: "TASK-130"
title: "Implement WebhookConfig CRUD UI (list, create, edit, delete, toggle)"
status: "todo"
priority: "high"
assignee: "frontend-agent"
epic: "EPIC-2.1"
phase: "Phase 2"
created: "2025-06-10"
updated: "2025-06-10"
depends_on: ["TASK-122"]
tags: ["webhook", "ui", "crud", "repository", "typescript"]
---

# Implement WebhookConfig CRUD UI (list, create, edit, delete, toggle)

## Description
Build the full set of UI components for managing webhook configurations, including listing, creating, editing, deleting, and toggling active status. Integrate all actions with the repository pattern and backend API. Ensure type safety, error handling, and accessibility.

## Acceptance Criteria
- [ ] WebhookConfig list view displays all configs from repository
- [ ] Create, edit, and delete dialogs/forms implemented
- [ ] Toggle active status integrated with PATCH endpoint
- [ ] All actions use repository interfaces and are type-safe
- [ ] Error handling and user feedback for all actions
- [ ] UI is accessible and responsive

## Technical Details
- Use Chakra UI for all components and dialogs
- Integrate with repository interfaces for all CRUD actions
- Reference backend API documentation for endpoints and data models
- Implement optimistic UI updates and error fallback

## Dependencies
- TASK-122 (repository pattern)

## Notes
This is a core user-facing feature. Follow best practices for UI/UX, accessibility, and error handling.

## Updates
- **2025-06-10**: Task created
