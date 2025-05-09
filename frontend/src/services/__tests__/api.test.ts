// @ts-nocheck
import { fetchApi } from '../api';

describe('fetchApi function', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
    process.env.NEXT_PUBLIC_API_TOKEN = 'test-token';
  });

  afterEach(() => {
    // @ts-ignore
    delete global.fetch;
    delete process.env.NEXT_PUBLIC_API_TOKEN;
  });

  test('includes Authorization header when token is present and converts body keys', async () => {
    const mockResponse = { status: 'success', data: { some_key: 'value' } };
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockResponse) });

    const result = await fetchApi<{ someKey: string }>('/test-endpoint', {
      method: 'POST',
      headers: { 'X-Test-Header': '1' },
      body: JSON.stringify({ someKey: 'value' })
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
          'X-Test-Header': '1'
        }),
        body: JSON.stringify({ some_key: 'value' })
      })
    );
    expect(result).toEqual({ someKey: 'value' });
  });

  test('throws ApiError on non-ok response with error payload', async () => {
    const mockError = { status: 'error', message: 'Bad request', code: 'BAD_REQUEST' };
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: false, status: 400, json: () => Promise.resolve(mockError) });

    await expect(fetchApi('/bad', { method: 'GET' })).rejects.toMatchObject({
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Bad request'
    });
  });

  test('handles object body and converts keys automatically', async () => {
    const mockResponse = { status: 'success', data: { test_key: 123 } };
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockResponse) });

    const result = await fetchApi<{ testKey: number }>('/object-test', {
      method: 'PUT',
      body: { testKey: 123 }
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/object-test'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ test_key: 123 })
      })
    );
    expect(result).toEqual({ testKey: 123 });
  });
}); 