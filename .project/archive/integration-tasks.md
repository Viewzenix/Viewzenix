# Frontend-Backend Integration Tasks

## Overview

This document outlines the necessary tasks to address the critical integration gap between the frontend and backend components of the Viewzenix platform. Manual testing has revealed that while the frontend UI appears functional, it is operating exclusively on localStorage with no actual API calls to the backend.

## Frontend Integration Tasks

### Task: Implement Frontend-Backend Integration for Webhook Management

#### Task Context
Critical testing has revealed that the webhook management functionality in the frontend is currently operating exclusively on localStorage with no actual API calls to the backend. Despite the recent improvements to the API client and toggle method alignment, the frontend and backend remain completely disconnected. This task requires implementing the actual integration between frontend services and backend endpoints.

#### Key Testing Findings (from `.project/docs/testing/manual_testing_report.md`)
- No HTTP requests are being made when performing webhook operations
- All webhook functionality continues to work even when the backend server is stopped
- Toggle functionality works correctly in the UI but uses only localStorage
- Create/edit operations require page refresh to update the UI, but toggle/delete update immediately
- Frontend webhook URLs use sequential numeric IDs instead of UUIDs

#### Research Required
Before implementation, please research:
1. Best practices for graceful API degradation with localStorage fallback in React applications
2. Strategies for optimistic UI updates when working with remote APIs
3. Error handling patterns for React applications when backend services are unavailable

#### Implementation Steps

1. **Set up your environment**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/frontend-backend-integration
   ```

2. **Update WebhookService to use actual backend API**:
   - Modify `frontend/src/services/webhook.service.ts` to use the API client for all CRUD operations
   - Maintain localStorage as fallback when API calls fail
   - Implement proper error handling for each operation
   - Ensure all methods (getAll, create, update, delete, toggleActive) make appropriate API calls

3. **Implement proper state management**:
   - Fix the state management in webhook list component to update immediately after create/edit operations
   - Ensure consistent behavior between create, edit, delete, and toggle operations
   - Implement optimistic UI updates where appropriate

4. **Add error handling for backend unavailability**:
   - Implement proper error messages when backend is unavailable
   - Add fallback to localStorage when API calls fail
   - Provide clear user feedback when operating in offline mode

5. **Fix any ID format discrepancies**:
   - Ensure webhook IDs are handled consistently between frontend and backend
   - Update URL display to match backend-generated URLs

6. **Add a favicon.ico file**:
   - Create and add a favicon.ico to the public directory to prevent 404 errors

7. **Create unit tests**:
   - Update existing tests to account for API integration
   - Add tests for fallback behavior when API is unavailable

#### Acceptance Criteria
- [ ] WebhookService makes actual API calls to backend endpoints for all operations
- [ ] Network requests appear in browser dev tools when performing webhook operations
- [ ] UI state updates immediately after all operations (create, edit, delete, toggle)
- [ ] Application gracefully handles backend unavailability by falling back to localStorage
- [ ] Clear feedback is provided to users when in offline mode
- [ ] Favicon 404 error is resolved
- [ ] All tests pass

#### Testing Instructions
After implementation, manually test:
1. All webhook operations with backend running
2. All webhook operations with backend stopped (should fall back to localStorage)
3. Refreshing the page after operations with backend running (data should persist from server)
4. Browser console should be free of errors
5. Network tab should show appropriate API calls

#### Task Update
Once completed:
1. Update the task status in `.project/kanban/board.md`
2. Document your implementation approach and any notable decisions in `.project/docs/guides/frontend-backend-integration.md`
3. Submit a pull request for review

## Backend Integration Tasks

### Task: Implement Webhook Configuration Management Endpoints

#### Task Context
Testing has revealed a critical integration gap: the frontend is currently unable to communicate with the backend for webhook management operations. While the backend has an endpoint for receiving webhook signals, it's missing the CRUD endpoints needed for managing webhook configurations. This task requires implementing these missing endpoints to enable proper frontend-backend integration.

#### Key Testing Findings (from `.project/docs/testing/manual_testing_report.md`)
- Missing CRUD endpoints for webhook configuration management
- UUID handling inconsistencies between model and controllers
- SQLite compatibility issues with UUID types
- Path parameters using `<uuid:id>` instead of `<string:id>` format
- No actual integration testing possible due to missing endpoints

#### Research Required
Before implementation, please research:
1. RESTful API best practices for resource management endpoints
2. SQLAlchemy model serialization/deserialization with case conversion
3. Flask blueprint pattern for organizing related endpoints

#### Implementation Steps

1. **Set up your environment**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/webhook-management-endpoints
   ```

2. **Implement CRUD endpoints for WebhookConfig**:
   - Create endpoints in `backend/app/api/routes/webhook_config.py`:
     - GET /webhooks - List all webhook configurations
     - GET /webhooks/{id} - Get specific webhook configuration
     - POST /webhooks - Create new webhook configuration
     - PUT or PATCH /webhooks/{id} - Update webhook configuration
     - DELETE /webhooks/{id} - Delete webhook configuration
     - PATCH /webhooks/{id}/toggle - Toggle webhook active status (already exists)
   
3. **Ensure consistent ID handling**:
   - Make sure all route parameters correctly handle string IDs (`<string:id>`)
   - Ensure URL generation for webhook endpoints is consistent

4. **Implement serialization/deserialization**:
   - Add proper request validation with appropriate schemas
   - Implement case conversion between snake_case (backend) and camelCase (frontend)
   - Handle JSON field serialization correctly

5. **Add proper error handling**:
   - Implement comprehensive error responses
   - Follow the error format from the API specification

6. **Create unit and integration tests**:
   - Write unit tests for each endpoint
   - Create integration tests that simulate frontend requests

#### Acceptance Criteria
- [ ] All CRUD endpoints for webhook configuration are implemented and working
- [ ] Endpoints accept and return properly formatted JSON with correct case convention
- [ ] Proper validation and error handling is implemented
- [ ] All endpoints work correctly with SQLite for development and testing
- [ ] All tests pass

#### Testing Instructions
After implementation, manually test with tools like Postman or curl:
1. Create a new webhook configuration
2. Retrieve the list of all webhook configurations
3. Get a specific webhook by ID
4. Update a webhook's properties
5. Toggle a webhook's active status
6. Delete a webhook configuration
7. Verify each operation persists to the database

#### Task Update
Once completed:
1. Update the task status in `.project/kanban/board.md`
2. Document your implementation in `.project/docs/guides/webhook-management-api.md`
3. Submit a pull request for review