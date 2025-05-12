# Supabase Integration Tasks

## Overview

This document outlines the tasks required to integrate Supabase as our database and backend service provider for the Viewzenix platform. Our testing has revealed a critical integration gap between the frontend and backend, and Supabase provides an excellent opportunity to solve this with minimal infrastructure overhead while maintaining professional code quality.

## Frontend Agent Tasks

### Task: Integrate Supabase Client with Frontend Services

#### Task Context
Our manual testing revealed that the frontend is currently operating exclusively with localStorage with no actual backend integration. Instead of building a custom integration with our Flask backend, we'll leverage Supabase's built-in features to provide a robust, scalable solution. This maintains professional code quality while accelerating development.

#### Key Testing Findings (from `.project/docs/testing/manual_testing_report.md`)
- No HTTP requests are being made when performing webhook operations
- All webhook functionality currently uses localStorage only
- The application has no actual backend persistence
- UI state management issues exist with inconsistent immediate updates

#### Research Required
Before implementation, please use tavily-mcp to research:
1. Best practices for integrating Supabase with Next.js applications
2. Supabase real-time subscriptions for immediate UI updates
3. Optimistic UI patterns when working with Supabase

#### Implementation Steps

1. **Set up your environment**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/supabase-integration
   ```

2. **Add Supabase Client Dependencies**:
   - Install the required packages:
     ```bash
     npm install @supabase/supabase-js
     ```
   - Create Supabase client configuration

3. **Use MCP-Hub to Work with Supabase**:
   - Use the MCP-Hub tool to call the Supabase MCP server for database interactions
   - Set up the necessary configuration for connecting to Supabase
   - Explore available Supabase tools through MCP

4. **Replace WebhookService Implementation**:
   - Modify `frontend/src/services/webhook.service.ts` to use Supabase client for CRUD operations
   - Implement real-time subscriptions for immediate UI updates
   - Maintain localStorage as fallback when offline
   - Use Supabase's PostgreSQL UUID handling for proper ID management

5. **Set Up Authentication Integration**:
   - Implement Supabase authentication for user management
   - Secure webhook endpoints based on user ownership

6. **Fix State Management with Real-time Updates**:
   - Use Supabase's real-time subscription features to update UI immediately
   - Ensure consistent behavior across create, edit, delete, and toggle operations

7. **Add Error Handling and Offline Support**:
   - Implement proper error handling for network issues
   - Add offline mode detection and appropriate user feedback
   - Sync offline changes when connection is restored

8. **Add a favicon.ico file**:
   - Create and add a favicon.ico to the public directory to prevent 404 errors

#### Acceptance Criteria
- [ ] WebhookService successfully uses Supabase for all CRUD operations
- [ ] Real-time updates appear in the UI without requiring page refresh
- [ ] Webhook configurations persist in Supabase database
- [ ] Application works offline with localStorage fallback
- [ ] Authentication is integrated for secure access
- [ ] Favicon 404 error is resolved
- [ ] All tests pass

#### Testing Instructions
After implementation, manually test:
1. All webhook operations with internet connection
2. All webhook operations while offline (should fall back to localStorage)
3. Real-time updates when webhook status is changed from another client
4. Browser console should be free of errors
5. Network tab should show proper Supabase API calls

#### Task Update
Once completed:
1. Update the task status in `.project/kanban/board.md`
2. Document your implementation approach in `.project/docs/guides/supabase-integration.md`
3. Submit a pull request for review

## Backend Agent Tasks

### Task: Migrate Backend to Supabase and Implement Webhook Signal Processing

#### Task Context
After evaluating our architecture and conducting testing, we've decided to migrate our backend database and authentication to Supabase while maintaining a lightweight Flask API server specifically for processing incoming webhook signals. This approach streamlines our architecture while maintaining proper separation of concerns.

#### Key Testing Findings (from `.project/docs/testing/manual_testing_report.md`)
- Backend lacks webhook configuration management endpoints
- PostgreSQL-specific features caused development complexity
- The current backend is disconnected from the frontend

#### Research Required
Before implementation, please use tavily-mcp to research:
1. Edge functions in Supabase for serverless webhook processing
2. Supabase PostgreSQL row-level security (RLS) policies for data protection
3. Best practices for connecting Flask APIs with Supabase

#### Implementation Steps

1. **Set up your environment**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/backend-supabase-migration
   ```

2. **Use MCP-Hub to Work with Supabase**:
   - Use the MCP-Hub tool to call the Supabase MCP server for database management
   - Create necessary tables with proper UUID primary keys
   - Set up PostgreSQL functions and triggers as needed

3. **Create Database Schema in Supabase**:
   - Define WebhookConfig table with proper columns and data types
   - Set up appropriate indexes and constraints
   - Configure row-level security policies for data protection

4. **Implement Edge Functions or Serverless Functions**:
   - Create serverless functions to process incoming webhook signals
   - Implement authentication and security validation
   - Connect processing with Supabase database

5. **Update Flask Backend for Webhook Signal Processing**:
   - Maintain a lightweight Flask API for receiving TradingView signals
   - Update to use Supabase client for data access
   - Implement proper error handling and logging

6. **Implement Broker Integration Flow**:
   - Connect webhook signals to broker API calls
   - Store execution results in Supabase

7. **Create Comprehensive Tests**:
   - Write tests for webhook signal processing
   - Test integration with Supabase database
   - Verify security and authentication

#### Acceptance Criteria
- [ ] WebhookConfig table is properly defined in Supabase with UUID primary keys
- [ ] Row-level security is implemented for data protection
- [ ] Webhook signal processing endpoint works correctly
- [ ] Integration with broker APIs is implemented or properly mocked
- [ ] All tests pass
- [ ] Documentation is updated to reflect Supabase integration

#### Testing Instructions
After implementation, manually test with tools like Postman or curl:
1. Send webhook signals to the processing endpoint
2. Verify proper validation and authentication
3. Confirm data storage in Supabase
4. Test integration with any broker APIs
5. Verify error handling for invalid inputs

#### Task Update
Once completed:
1. Update the task status in `.project/kanban/board.md`
2. Document your implementation approach in `.project/docs/guides/supabase-backend-integration.md`
3. Submit a pull request for review