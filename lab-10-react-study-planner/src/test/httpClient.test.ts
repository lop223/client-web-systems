import { afterEach, describe, expect, it, vi } from 'vitest';
import { httpClient } from '../api/httpClient';

describe('httpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('надсилає GET-запит за адресою з VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'https://dummyjson.com/');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ todos: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(httpClient.get('/todos')).resolves.toEqual({ todos: [] });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/todos',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('повертає HTTP-помилку для невдалої відповіді', async () => {
    vi.stubEnv('VITE_API_URL', 'https://dummyjson.com');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await expect(httpClient.get('/todos/999')).rejects.toMatchObject({
      name: 'HttpError',
      status: 404,
      responseBody: { message: 'Not found' },
    });
  });

  it('повідомляє, якщо VITE_API_URL не налаштовано', async () => {
    vi.stubEnv('VITE_API_URL', '');

    await expect(httpClient.get('/todos')).rejects.toThrow('VITE_API_URL is not configured');
  });
});
