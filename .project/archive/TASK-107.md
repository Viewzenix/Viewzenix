# TASK-107: Fix Webhook Status Toggle Functionality

## Priority
Critical

## Type
Bug Fix

## Status
Todo

## Description
During manual testing of the webhook management functionality, we discovered that the webhook status toggle feature is completely non-functional. When attempting to toggle a webhook's active status, the application displays an error: "_services_webhook_service__WEBPACK_IMPORTED_MODULE_3__._webhookService.toggleWebhookActive is not a function".

This appears to be an issue with how the WebhookService is exported, imported, or how the toggleWebhookActive method is being called. This is a critical bug as it prevents users from activating or deactivating webhooks, which is a core feature of the platform.

## Acceptance Criteria
- [ ] Fix the WebhookService import/export to properly expose the toggleWebhookActive method
- [ ] Ensure the webhook status can be toggled between active and inactive
- [ ] Verify the UI updates correctly to reflect the status change
- [ ] Add error handling to provide user feedback if the toggle operation fails
- [ ] Ensure the status change persists after page refreshes

## Technical Details
The error message suggests that the WebhookService is being accessed as `_webhookService` instead of directly accessing the exported service. This could be due to an incorrect import statement, a change in how the service is exported, or a mismatch between the implementation and how it's being called.

The affected code is likely in the webhook setup page component and related to status toggle UI elements.

## Related Tasks
- TASK-106: WebhookService Backend Integration

## Estimated Time
2-4 hours