export class HttpError extends Error {
  public readonly status: number;
  public readonly responseBody?: unknown;

  constructor(message: string, status: number, responseBody?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured');
  }

  return apiUrl;
};

const buildUrl = (path: string): string => {
  const baseUrl = getApiUrl().replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  return `${baseUrl}/${normalizedPath}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers, ...fetchOptions } = options;

  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new HttpError(
      `Http request failed with status ${response.status}`,
      response.status,
      responseBody
    );
  }

  return responseBody as T;
};

export const httpClient = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return request(path, {
      ...options,
      method: 'GET',
    });
  },

  post<T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body,
    });
  },

  put<T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body,
    });
  },

  patch<T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      body,
    });
  },

  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'DELETE',
    });
  },
};
