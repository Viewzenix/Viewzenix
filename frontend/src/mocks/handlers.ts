import { http, HttpResponse } from 'msw';
import type { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData } from '@/types/webhook';

// Default notification preferences
const defaultNotificationPreferences = {
  email: false,
  browser: true,
  onSuccess: true,
  onFailure: true
};

// In-memory storage for mock data
let mockWebhooks: WebhookConfig[] = [
  {
    id: '1',
    name: 'Default Webhook',
    description: 'Default webhook configuration',
    webhookUrl: 'https://api.viewzenix.com/webhook/1',
    securityToken: 'abc123',
    notificationPreferences: defaultNotificationPreferences,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const handlers = [
  // Get all webhooks
  http.get('/api/webhooks', () => {
    return HttpResponse.json(mockWebhooks);
  }),

  // Get webhook by ID
  http.get('/api/webhooks/:id', ({ params }) => {
    const { id } = params;
    const webhook = mockWebhooks.find(w => w.id === id);
    
    if (!webhook) {
      return HttpResponse.json(
        { error: { message: 'Webhook not found' } },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(webhook);
  }),

  // Create webhook
  http.post('/api/webhooks', async ({ request }) => {
    const data = await request.json() as CreateWebhookConfigData;
    
    // Validate required fields
    if (!data.name || !data.securityToken) {
      return HttpResponse.json(
        { 
          error: { 
            message: 'Name and security token are required',
            fields: {
              name: !data.name ? 'Name is required' : undefined,
              securityToken: !data.securityToken ? 'Security token is required' : undefined
            }
          } 
        },
        { status: 400 }
      );
    }
    
    // Create new webhook
    const newWebhook: WebhookConfig = {
      id: String(mockWebhooks.length + 1),
      name: data.name,
      description: data.description || '',
      webhookUrl: `https://api.viewzenix.com/webhook/${mockWebhooks.length + 1}`,
      securityToken: data.securityToken,
      notificationPreferences: data.notificationPreferences || defaultNotificationPreferences,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockWebhooks.push(newWebhook);
    
    return HttpResponse.json(
      { 
        webhook: newWebhook,
        success: true
      },
      { status: 201 }
    );
  }),

  // Update webhook
  http.put('/api/webhooks/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json() as UpdateWebhookConfigData;
    
    const index = mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { error: { message: 'Webhook not found' } },
        { status: 404 }
      );
    }
    
    // Update webhook
    mockWebhooks[index] = {
      ...mockWebhooks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(
      { 
        webhook: mockWebhooks[index],
        success: true
      }
    );
  }),

  // Delete webhook
  http.delete('/api/webhooks/:id', ({ params }) => {
    const { id } = params;
    
    const index = mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { error: { message: 'Webhook not found' } },
        { status: 404 }
      );
    }
    
    // Delete webhook
    mockWebhooks.splice(index, 1);
    
    return HttpResponse.json(
      { 
        id,
        success: true
      }
    );
  }),
]; 