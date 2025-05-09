# Supabase Frontend Integration Guide

This document outlines the approach and key decisions for integrating Supabase into the Viewzenix frontend, providing real-time updates and offline support.

## 1. Supabase Configuration

- Installed `@supabase/supabase-js` and created a singleton client in `frontend/src/config/supabase.config.ts`.
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Exposed `supabase` client and `isSupabaseAvailable()` helper to check availability.

## 2. Real-time Subscriptions

- Utilized Supabase Realtime by subscribing to the `webhooks` table:
  ```ts
  supabase
    .channel('webhook-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'webhooks' }, payload => {
      // payload contains insert/update/delete info
    })
    .subscribe();
  ```
- On any database change, we fetch the latest records and update local cache.
- Components subscribe via `webhookService.subscribe(callback)` for immediate UI updates.

## 3. CRUD Operations with Fallback

- Priority:
  1. **Supabase** (when available)
  2. **Traditional API** (fallback)
  3. **localStorage** (offline)

- Implemented in `frontend/src/services/webhook.service.ts`:
  - `getWebhooks()`, `getWebhookById()`
  - `createWebhook()`, `updateWebhook()`, `deleteWebhook()`
  - `toggleWebhookActive()`
- Each method attempts Supabase first, then API, then localStorage.

## 4. Offline Support Strategy

- On init, client checks availability:
  - `isSupabaseAvailable()` for Supabase
  - `isApiAvailable()` for backend API
- localStorage cache (`viewzenix_webhooks`) serves as persistent storage when offline.
- User sees existing data instantly, and any operations queue to localStorage until online.

## 5. State Management and Subscription

- `WebhookService` maintains an internal array `mockWebhooks` as the single source of truth.
- Provides a `subscribe(callback)` method for components to listen for changes.
- After any data mutation (create/update/delete/toggle), the service:
  1. Updates local cache
  2. Persists to localStorage
  3. Notifies all subscribers

## 6. Favicon Support

- Added an empty `favicon.ico` in `frontend/public` to prevent 404 errors.
- Place a production-ready favicon in the same path when available.

## 7. Next Steps

- **Testing**: Write unit tests mocking Supabase client and offline fallback.
- **Error Handling**: Surface user-friendly messages on errors.
- **Styling**: Update UI to indicate online/offline status.
- **Documentation**: Update README and CONTRIBUTING guides.

---
*Document generated on {{DATE}} by the Viewzenix frontend integration task.*