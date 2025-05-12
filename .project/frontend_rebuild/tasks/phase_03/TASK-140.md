---
id: "TASK-140"
title: "Implement global SL/TP monitoring and visualization"
status: "todo"
priority: "high"
assignee: "frontend-agent"
epic: "EPIC-3.1"
phase: "Phase 3"
created: "2025-06-10"
updated: "2025-06-10"
depends_on: ["TASK-122", "TASK-131"]
tags: ["sl-tp", "monitoring", "ui", "real-time"]
---

# Implement global SL/TP monitoring and visualization

## Description
Build UI components for monitoring global stop-loss and take-profit (SL/TP) levels across all bots and accounts. Integrate with the repository and backend for real-time updates and risk visualization. Ensure type safety, error handling, and accessibility.

## Acceptance Criteria
- [ ] Global SL/TP dashboard displays real-time risk metrics
- [ ] Visualization of SL/TP triggers and current exposure
- [ ] Integration with repository and backend for live data
- [ ] Error handling and user feedback for all actions
- [ ] UI is accessible and responsive

## Technical Details
- Use Chakra UI for dashboard and visualization components
- Integrate with repository interfaces for SL/TP data
- Implement real-time updates using Supabase subscriptions or polling

## Dependencies
- TASK-122 (repository pattern)
- TASK-131 (repository-API integration)

## Notes
Global SL/TP monitoring is critical for risk management. Follow best practices for data visualization and user feedback.

## Updates
- **2025-06-10**: Task created 