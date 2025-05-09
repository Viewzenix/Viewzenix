# API Client & WebhookService Improvements

This document summarizes the recent structural and functional improvements made to the frontend API client (`api.ts`) and `WebhookService`.

## 1. Case Conversion Utilities Extraction
- Extracted `camelToSnake`, `snakeToCamel`, `objectToCamelCase`, and `objectToSnakeCase` from `api.ts` into `frontend/src/utils/caseConversion.ts`.
- Added TODO in `api.ts` to remove duplicate definitions once safe.

## 2. Health Check Caching
- Introduced `cachedApiAvailable` and `cachedApiCheckTime` in `api.ts`.
- Implemented a 1-minute TTL (`API_HEALTH_CHECK_TTL`) to cache the result of `/health` checks, reducing redundant network calls.

## 3. Authorization Header Injection
- In `fetchApi`, automatically inject an `Authorization: Bearer <token>` header if a token is present.
- Token sources: `NEXT_PUBLIC_API_TOKEN` env var or `localStorage.getItem('api_token')`.

## 4. JSDoc Corrections
- Corrected doc comments for `objectToCamelCase` and `objectToSnakeCase` in `api.ts` to accurately reflect their behavior.

## 5. Simplified Toggle Logic
- In `WebhookService.toggleWebhookActive`, simplified flow to call `webhookApi.toggleActive(id)` directly and return `response.data.webhook`.
- Fallback to `updateWebhook` only on API failure.

## 6. Directory Structure Updates
- Created `frontend/src/utils/` for utility modules (e.g., `caseConversion.ts`).

## 7. Removed Stale Duplicate Code
- In `frontend/src/services/webhook.service.ts`, eliminated a leftover duplicate block of code in the `toggleWebhookActive` implementation that was causing syntax and scope errors. This restores correct method definitions and removes orphaned code fragments.

## Next Steps
- Remove duplicate case conversion definitions from `api.ts` once extraction is verified.
- Add unit tests for the new `caseConversion` utilities and updated `fetchApi` behavior.
- Consider further refactoring of API/client patterns (e.g., interceptors, logging). 