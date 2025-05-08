---
id: "TASK-003"
title: "Implement Trade Router service"
status: "done" # backlog, todo, in-progress, review, done
priority: "high" # low, medium, high, critical
assignee: "backend-agent"
epic: "EPIC-1.2"
phase: "Phase 1"
created: "2024-05-10"
updated: "2024-05-10"
depends_on: ["TASK-001", "TASK-002"]
tags: ["core", "trading", "webhook"]
---

# Implement Trade Router service

## Description
Create a Trade Router service that classifies and normalizes incoming webhook data from TradingView into standardized trade objects that can be processed by the order engine.

## Acceptance Criteria
- [x] Create data models for trades with proper typing
- [x] Implement asset class classification based on symbol patterns
- [x] Normalize webhook data into standard trade format
- [x] Validate trades against broker restrictions
- [x] Implement proper error handling with specific exception types
- [x] Add comprehensive logging throughout the process
- [x] Create unit tests for the Trade Router

## Implementation Notes
- Created `app/core/models/trade.py` with data models for trades
- Implemented `app/core/services/trade_router.py` with the Trade Router service
- Added asset classification logic for stocks, crypto, and forex
- Implemented validation logic for different order types
- Added unit tests in `tests/unit/test_trade_router.py`