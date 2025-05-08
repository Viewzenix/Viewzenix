---
title: "Development Workflow Guide"
created: "2024-05-08"
updated: "2024-05-08"
version: "1.0.0"
tags: ["workflow", "guide", "development-process", "backend", "frontend"]
---

# Development Workflow Guide

> This document outlines standard operational workflows for both Backend and Frontend Developers working on the Viewzenix platform. Before starting any workflow, consult the user stories in `.project/stories/` and the project roadmap (`.project/roadmap.md`) for context and requirements.

## Backend Development Workflows

### 1. Implement Webhook Receiver Endpoint

**Trigger:** Request to create or update the TradingView webhook endpoint

**Steps:**
1. Review related user stories and roadmap epics
2. Create a Flask blueprint for `/webhook` that accepts POST requests
3. Implement JSON schema validation for the incoming payload
4. Add logging and appropriate response handling
5. Test the endpoint with sample payloads
6. Update task statuses in the Kanban board

### 2. Develop Trade Classification & Order Execution Logic

**Trigger:** Request for core trade processing logic implementation

**Steps:**
1. Create the Trade Classifier module with `get_asset_class(symbol)` function
2. Implement logic to interpret webhook data into trade types
3. Incorporate broker restrictions for Alpaca
4. Implement the Order Engine with AlpacaAdapter
5. Test the full order execution flow
6. Update task statuses in the Kanban board

### 3. Implement Per-Order SL/TP and Cleanup Service

**Trigger:** Request for stop-loss/take-profit functionality and cleanup of orphan orders

**Steps:**
1. Add logic to attach stop-loss and take-profit orders after entry
2. Calculate SL/TP prices based on configuration
3. Create the Cleanup Service to identify and cancel orphaned orders
4. Test SL/TP calculation and the cleanup service
5. Update task statuses in the Kanban board

### 4. Implement Global SL/TP Tracker

**Trigger:** Request for global portfolio protection feature

**Steps:**
1. Create tracker service that monitors account equity
2. Implement logic to check against global SL/TP thresholds
3. Add position liquidation and trading pause features
4. Test equity monitoring with simulated equity changes
5. Update task statuses in the Kanban board

### 5. Finalize Backend: API for UI and Refactoring

**Trigger:** Request to finalize backend APIs and refactor code

**Steps:**
1. Create any missing API endpoints needed by the frontend
2. Set up proper CORS handling
3. Refactor code for improved maintainability
4. Run the full test suite
5. Update task statuses in the Kanban board

## Frontend Development Workflows

### 1. Initialize Frontend Project Structure

**Trigger:** Request for new front-end setup or major refactor

**Steps:**
1. Set up React with TypeScript (Next.js or Create React App per requirements)
2. Create basic project structure with organized directories
3. Implement persistent navigation (sidebar or tab menu)
4. Set up routing between main sections
5. Present initial UI structure for feedback
6. Update task statuses in the Kanban board

### 2. Implement Bot Settings Dashboard UI

**Trigger:** Request for UI to manage bot configuration settings

**Steps:**
1. Create "Bots" section with settings panel
2. Implement UI controls for all configuration options
3. Connect to backend API to fetch current settings
4. Implement save mechanism to update settings
5. Test form validation and feedback
6. Update task statuses in the Kanban board

### 3. Integrate Log Viewer and Real-Time Updates

**Trigger:** Request for UI to view system activity logs

**Steps:**
1. Create "Logs" section with log display component
2. Implement API calls to fetch log entries
3. Display logs in reverse chronological order
4. Add periodic refresh mechanism (polling)
5. Test with various log entry formats
6. Update task statuses in the Kanban board

### 4. Implement Webhook Setup & Broker Info Pages

**Trigger:** Request for UI to assist with initial platform setup

**Steps:**
1. Create "Webhook Setup" section with endpoint URL and instructions
2. Create "Brokers" section with connection status
3. Test copy functionality and verify instructions
4. Update task statuses in the Kanban board

### 5. Frontend-Backend Integration Testing & Final Touches

**Trigger:** Request for end-to-end testing and UI polish

**Steps:**
1. Integrate all frontend UI with corresponding backend APIs
2. Add loading states, success messages, and error handling
3. Perform end-to-end testing of all features
4. Test edge cases and error scenarios
5. Update task statuses in the Kanban board 