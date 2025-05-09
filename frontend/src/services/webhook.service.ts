import { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData, CreateWebhookResponse, UpdateWebhookResponse, DeleteWebhookResponse } from '@/types/webhook';
import { webhookApi, ApiError, isApiAvailable } from '@/services/api';
import { USE_API, FORCE_LOCAL_STORAGE } from '@/config/api.config';
import { supabase, isSupabaseAvailable } from '@/config/supabase.config';
import { RealtimeChannel, PostgrestError } from '@supabase/supabase-js';

const isBrowser = () => typeof window !== 'undefined';

// Define the Supabase webhook record structure
interface SupabaseWebhookRecord {
  id: string;
  name: string;
  description?: string;
  webhook_url: string;
  security_token: string;
  notification_preferences: {
    email: boolean;
    browser: boolean;
    on_success: boolean;
    on_failure: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Service for managing webhook configurations with Supabase, API, and localStorage fallback.
 */
class WebhookService {
  private mockWebhooks: WebhookConfig[] = [];
  private readonly STORAGE_KEY = 'viewzenix_webhooks';
  private apiAvailable = false;
  private supabaseAvailable = false;
  private realtimeChannel: RealtimeChannel | null = null;
  private webhooksSubscribers: Set<(webhooks: WebhookConfig[]) => void> = new Set();

  constructor() {
    if (isBrowser()) {
      this.loadFromStorage();
      this.initSupabase();
    }
    if (isBrowser() && USE_API && !FORCE_LOCAL_STORAGE) {
      this.checkApiAvailability();
    }
  }

  /** Initialize Supabase and real-time subscriptions */
  private async initSupabase(): Promise<void> {
    if (!isBrowser()) return;
    this.supabaseAvailable = await isSupabaseAvailable();
    if (!this.supabaseAvailable) return;
    this.realtimeChannel = supabase
      .channel('webhook-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'webhooks' }, () => this.refreshWebhooksFromSupabase())
      .subscribe();
  }

  /** Refresh webhooks from Supabase */
  private async refreshWebhooksFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('webhooks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const webhooks = data.map((w: SupabaseWebhookRecord) => this.transformSupabaseWebhook(w));
      this.mockWebhooks = webhooks;
      this.saveToStorage();
      this.notifySubscribers();
    } catch (e) {
      console.error('Error refreshing from Supabase:', e);
    }
  }

  /** Transform Supabase record to WebhookConfig */
  private transformSupabaseWebhook(record: SupabaseWebhookRecord): WebhookConfig {
    return {
      id: record.id,
      name: record.name,
      description: record.description || '',
      webhookUrl: record.webhook_url,
      securityToken: record.security_token,
      notificationPreferences: {
        email: record.notification_preferences.email,
        browser: record.notification_preferences.browser,
        onSuccess: record.notification_preferences.on_success,
        onFailure: record.notification_preferences.on_failure,
      },
      isActive: record.is_active,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  /** Load from localStorage */
  private loadFromStorage(): void {
    if (!isBrowser()) return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.mockWebhooks = stored ? JSON.parse(stored) : [];
    } catch {
      this.mockWebhooks = [];
    }
  }

  /** Save to localStorage */
  private saveToStorage(): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mockWebhooks));
    } catch {
      // ignore
    }
  }

  /** Subscribe to webhook changes */
  public subscribe(callback: (webhooks: WebhookConfig[]) => void): () => void {
    this.webhooksSubscribers.add(callback);
    callback([...this.mockWebhooks]);
    return () => this.webhooksSubscribers.delete(callback);
  }

  /** Notify subscribers */
  private notifySubscribers(): void {
    const snapshot = [...this.mockWebhooks];
    this.webhooksSubscribers.forEach(cb => cb(snapshot));
  }

  /** Check API availability */
  public async checkApiAvailability(): Promise<boolean> {
    try {
      this.apiAvailable = await isApiAvailable();
    } catch {
      this.apiAvailable = false;
    }
    return this.apiAvailable;
  }

  /** Should use Supabase? */
  private shouldUseSupabase(): boolean {
    return isBrowser() && this.supabaseAvailable;
  }

  /** Should use API? */
  private shouldUseApi(): boolean {
    return isBrowser() && USE_API && this.apiAvailable && !FORCE_LOCAL_STORAGE && !this.shouldUseSupabase();
  }

  /** Get all webhooks */
  public async getWebhooks(): Promise<WebhookConfig[]> {
    if (this.shouldUseSupabase()) {
      try {
        const { data, error } = await supabase.from('webhooks').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          const webhooks = data.map((w: SupabaseWebhookRecord) => this.transformSupabaseWebhook(w));
          this.mockWebhooks = webhooks;
          this.saveToStorage();
          return webhooks;
        }
      } catch {
        // fallback
      }
    } else if (this.shouldUseApi()) {
      try {
        const res = await webhookApi.getAll();
        return res.data;
      } catch {
        // fallback
      }
    }
    return [...this.mockWebhooks];
  }

  /** Get webhook by ID */
  public async getWebhookById(id: string): Promise<WebhookConfig | null> {
    if (this.shouldUseSupabase()) {
      try {
        const { data, error } = await supabase.from('webhooks').select('*').eq('id', id).single();
        if (!error && data) return this.transformSupabaseWebhook(data);
        if ((error as PostgrestError)?.code === 'PGRST116') return null;
      } catch {
        // fallback
      }
    } else if (this.shouldUseApi()) {
      try {
        const res = await webhookApi.getById(id);
        return res.data;
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return null;
      }
    }
    return this.mockWebhooks.find(w => w.id === id) || null;
  }

  /** Create a new webhook */
  public async createWebhook(data: CreateWebhookConfigData): Promise<CreateWebhookResponse> {
    if (!data.name || !data.securityToken) throw new Error('Name and security token required');
    if (this.shouldUseSupabase()) {
      const id = crypto.randomUUID();
      const webhookUrl = `https://api.viewzenix.com/webhook/${id}`;
      const record = {
        id,
        name: data.name,
        description: data.description,
        webhook_url: webhookUrl,
        security_token: data.securityToken,
        notification_preferences: {
          email: data.notificationPreferences.email,
          browser: data.notificationPreferences.browser,
          on_success: data.notificationPreferences.onSuccess,
          on_failure: data.notificationPreferences.onFailure,
        },
        is_active: data.isActive,
      };
      try {
        const { data: newRec, error } = await supabase.from('webhooks').insert(record).select('*').single();
        if (!error && newRec) {
          const hook = this.transformSupabaseWebhook(newRec);
          this.mockWebhooks.unshift(hook);
          this.saveToStorage();
          this.notifySubscribers();
          return { status: 'success', message: '', data: { webhook: hook, success: true } };
        }
      } catch {
        // fallback
      }
    } else if (this.shouldUseApi()) {
      const res = await webhookApi.create(data);
      if (res.data.webhook) {
        this.mockWebhooks.unshift(res.data.webhook);
        this.saveToStorage();
        this.notifySubscribers();
      }
      return res;
    }
    const id = crypto.randomUUID();
    const hook: WebhookConfig = { ...data, id, webhookUrl: `https://api.viewzenix.com/webhook/${id}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.mockWebhooks.unshift(hook);
    this.saveToStorage();
    this.notifySubscribers();
    return { status: 'success', message: '', data: { webhook: hook, success: true } };
  }

  /** Update existing webhook */
  public async updateWebhook(id: string, data: UpdateWebhookConfigData): Promise<UpdateWebhookResponse> {
    if (this.shouldUseSupabase()) {
      const payload = { ...this.transformToSupabaseFormat(data), updated_at: new Date().toISOString() };
      try {
        const { data: upd, error } = await supabase.from('webhooks').update(payload).eq('id', id).select('*').single();
        if (!error && upd) {
          const hook = this.transformSupabaseWebhook(upd);
          this.replaceLocal(hook);
          return { status: 'success', message: '', data: { webhook: hook, success: true } };
        }
      } catch {
        // fallback
      }
    } else if (this.shouldUseApi()) {
      const res = await webhookApi.update(id, data);
      if (res.data.webhook) this.replaceLocal(res.data.webhook);
      return res;
    }
    const idx = this.mockWebhooks.findIndex(w => w.id === id);
    if (idx === -1) throw new Error(`Webhook with ID ${id} not found`);
    const updated: WebhookConfig = { ...this.mockWebhooks[idx], ...data, updatedAt: new Date().toISOString() };
    this.mockWebhooks[idx] = updated;
    this.saveToStorage();
    this.notifySubscribers();
    return { status: 'success', message: '', data: { webhook: updated, success: true } };
  }

  /** Delete a webhook */
  public async deleteWebhook(id: string): Promise<DeleteWebhookResponse> {
    if (this.shouldUseSupabase()) {
      try {
        const { error } = await supabase.from('webhooks').delete().eq('id', id);
        if (!error) {
          this.removeLocal(id);
          return { status: 'success', message: '', data: { id, success: true } };
        }
      } catch {
        // fallback
      }
    } else if (this.shouldUseApi()) {
      const res = await webhookApi.delete(id);
      this.removeLocal(id);
      return res;
    }
    this.removeLocal(id);
    return { status: 'success', message: '', data: { id, success: true } };
  }

  /** Toggle active status */
  public async toggleWebhookActive(id: string, isActiveOverride?: boolean): Promise<WebhookConfig> {
    let newState = isActiveOverride;
    if (newState === undefined) {
      const hook = await this.getWebhookById(id);
      if (!hook) throw new Error(`Webhook with ID ${id} not found`);
      newState = !hook.isActive;
    }
    if (this.shouldUseSupabase()) {
      try {
        const { data: upd, error } = await supabase.from('webhooks').update({ is_active: newState, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
        if (!error && upd) {
          const hook = this.transformSupabaseWebhook(upd);
          this.replaceLocal(hook);
          return hook;
        }
      } catch {
        // fallback
      }
    }
    if (this.shouldUseApi()) {
      const hook = (await webhookApi.toggleActive(id)).data.webhook;
      this.replaceLocal(hook);
      return hook;
    }
    const hookFromLocal = await this.updateWebhook(id, { isActive: newState });
    return hookFromLocal.data.webhook;
  }

  /** Replace or insert in local cache */
  private replaceLocal(hook: WebhookConfig) {
    const idx = this.mockWebhooks.findIndex(w => w.id === hook.id);
    if (idx !== -1) this.mockWebhooks[idx] = hook;
    else this.mockWebhooks.unshift(hook);
    this.saveToStorage();
    this.notifySubscribers();
  }

  /** Remove from local cache */
  private removeLocal(id: string) {
    this.mockWebhooks = this.mockWebhooks.filter(w => w.id !== id);
    this.saveToStorage();
    this.notifySubscribers();
  }

  /** Transform to Supabase format */
  private transformToSupabaseFormat(data: Partial<WebhookConfig>): any {
    const result: any = {};
    if (data.name !== undefined) result.name = data.name;
    if (data.description !== undefined) result.description = data.description;
    if (data.securityToken !== undefined) result.security_token = data.securityToken;
    if (data.isActive !== undefined) result.is_active = data.isActive;
    if (data.notificationPreferences) {
      result.notification_preferences = {
        email: data.notificationPreferences.email,
        browser: data.notificationPreferences.browser,
        on_success: data.notificationPreferences.onSuccess,
        on_failure: data.notificationPreferences.onFailure,
      };
    }
    return result;
  }
}

export const webhookService = new WebhookService();