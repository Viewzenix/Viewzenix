# Project Kanban Board
> Last updated: 2024-05-15

## 📋 Backlog

*Tasks and user stories that are not yet scheduled for implementation.*

- [US-010: Basic UI Navigation](../stories/frontend/US-010.md) `ui` `navigation` `core-functionality` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
  - [TASK-104: Populate Sidebar with links to the main pages, indicate active page](../tasks/frontend/TASK-104.md) `ui` `react` `navigation` ![Priority: Medium](https://img.shields.io/badge/Priority-Medium-yellow)

## 🔍 To Do

*Tasks ready to be worked on, prioritized and scheduled for the current sprint/cycle.*

- [TASK-106: Update WebhookService to integrate with backend API](../tasks/frontend/TASK-106.md) `integration` `api` `frontend` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) (Blocked by TASK-008)
- [TASK-007: Implement webhook history tracking](../tasks/backend/TASK-007.md) `api` `database` `backend` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
- [TASK-008: Implement Webhook Configuration Management Endpoints](../tasks/backend/TASK-008.md) `api` `flask` `webhook` `integration` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)

## ⏳ In Progress

*Tasks currently being worked on by an agent.*

## 🔎 Review

*Tasks completed and awaiting review/testing.*

- [TASK-008: Implement Webhook Configuration Management Endpoints](../tasks/backend/TASK-008.md) `api` `database` `webhook` `rest` `crud` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-11)

## ✅ Done (Last 7 days)

*Recently completed tasks and user stories.*

- [TASK-101: Create main App layout component with a persistent sidebar for navigation](../tasks/frontend/TASK-101.md) `ui` `react` `layout` `navigation` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @frontend-agent (2024-09-27)
- [TASK-105: Implement Webhook Configuration Form and Management UI](../tasks/frontend/TASK-105.md) `ui` `react` `forms` `webhook` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @frontend-agent (2024-09-27)

- [US-001: Receive TradingView Webhook](../stories/backend/US-001.md) `webhook` `api` `security` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
  - [TASK-001: Set up basic Flask application structure](../tasks/backend/TASK-001.md) `setup` `flask` `architecture` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-10)
  - [TASK-002: Define `/webhook` route in a Flask Blueprint](../tasks/backend/TASK-002.md) `api` `flask` `webhook` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-10)

- [US-002: Process Trading Orders](../stories/backend/US-002.md) `orders` `trading` `broker` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
  - [TASK-003: Implement Trade Router service](../tasks/backend/TASK-003.md) `core` `trading` `webhook` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-10)
  - [TASK-004: Implement Order Engine service](../tasks/backend/TASK-004.md) `core` `trading` `orders` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-10)
  - [TASK-005: Implement Broker Adapter interface and Alpaca implementation](../tasks/backend/TASK-005.md) `core` `trading` `broker` `alpaca` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-10)
  - [TASK-006: Enhance webhook endpoint to use order processing services](../tasks/backend/TASK-006.md) `api` `webhook` `integration` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent (2024-05-10)

## How to Use This Board

1. **Adding an item:** Add a link to a task or story in the appropriate column. Use the following format:
   ```
   - [ID: Title](path/to/file.md) `tag1` `tag2` ![Priority: Level](https://img.shields.io/badge/Priority-Level-color)
   ```

2. **Moving an item:** When a task changes status, move it to the appropriate column and update the status in the task file.

3. **Indicating assignment:** Add `@agent-name` after the task link to show who is working on it.

4. **Completed items:** Add the completion date in parentheses after the task in the Done column.

5. **Related tasks:** For user stories with in-progress tasks, list the tasks as sub-items under the story. 