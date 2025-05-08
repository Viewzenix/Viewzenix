# TASK-106: Update WebhookService to integrate with backend API

**Priority:** High
**Type:** Integration
**Assignee:** @frontend-agent
**Status:** Todo

## Description

Now that both the frontend webhook form and backend webhook endpoint have been implemented, we need to update the frontend WebhookService to integrate with the actual backend API instead of using mock data. This will enable end-to-end functionality for creating and managing webhooks.

## Context

The frontend currently has a mock WebhookService that simulates API calls with setTimeout. The backend has implemented a fully functional webhook endpoint that can receive and process webhook requests. We need to connect these two components to enable real functionality.

## Acceptance Criteria

- [ ] Update the WebhookService to make actual API calls to the backend
- [ ] Ensure webhook payload structure matches the backend's expected format
- [ ] Implement proper error handling for API responses
- [ ] Update the webhook form to display actual error messages from the backend
- [ ] Add environment configuration for API URLs
- [ ] Ensure security token handling is consistent with backend expectations
- [ ] Update types to match the backend's data structures

## Dependencies

- Frontend webhook form implementation (TASK-105) - Completed
- Backend webhook endpoint implementation (TASK-002) - Completed
- Backend order processing implementation (TASK-006) - Completed

## Resources

- Backend API documentation (when available)
- Current WebhookService implementation
- Backend webhook route implementation

## Notes

- The backend expects specific fields in the webhook payload, including passphrase, ticker, and action
- Error handling should account for different types of errors (validation errors, server errors, network errors)
- Consider adding a configuration file for environment-specific settings (dev, staging, prod)