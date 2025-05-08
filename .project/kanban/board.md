# Project Kanban Board
> Last updated: 2024-05-10

## 📋 Backlog

*Tasks and user stories that are not yet scheduled for implementation.*

- [US-010: Basic UI Navigation](../stories/frontend/US-010.md) `ui` `navigation` `core-functionality` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
  - [TASK-101: Create main App layout component with a persistent sidebar for navigation](../tasks/frontend/TASK-101.md) `ui` `react` `layout` `navigation` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
  - [TASK-104: Populate Sidebar with links to the main pages, indicate active page](../tasks/frontend/TASK-104.md) `ui` `react` `navigation` ![Priority: Medium](https://img.shields.io/badge/Priority-Medium-yellow)

## 🔍 To Do

*Tasks ready to be worked on, prioritized and scheduled for the current sprint/cycle.*

## ⏳ In Progress

*Tasks currently being worked on by an agent.*

## 🔎 Review

*Tasks completed and awaiting review/testing.*

- [US-001: Receive TradingView Webhook](../stories/backend/US-001.md) `webhook` `api` `security` ![Priority: High](https://img.shields.io/badge/Priority-High-orange)
  - [TASK-001: Set up basic Flask application structure](../tasks/backend/TASK-001.md) `setup` `flask` `architecture` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent
  - [TASK-002: Define `/webhook` route in a Flask Blueprint](../tasks/backend/TASK-002.md) `api` `flask` `webhook` ![Priority: High](https://img.shields.io/badge/Priority-High-orange) @backend-agent

## ✅ Done (Last 7 days)

*Recently completed tasks and user stories.*

## How to Use This Board

1. **Adding an item:** Add a link to a task or story in the appropriate column. Use the following format:
   ```
   - [ID: Title](path/to/file.md) `tag1` `tag2` ![Priority: Level](https://img.shields.io/badge/Priority-Level-color)
   ```

2. **Moving an item:** When a task changes status, move it to the appropriate column and update the status in the task file.

3. **Indicating assignment:** Add `@agent-name` after the task link to show who is working on it.

4. **Completed items:** Add the completion date in parentheses after the task in the Done column.

5. **Related tasks:** For user stories with in-progress tasks, list the tasks as sub-items under the story. 