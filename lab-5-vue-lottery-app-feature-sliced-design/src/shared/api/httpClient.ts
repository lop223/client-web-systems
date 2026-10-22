export interface HttpAuthProvider {
  getAccessToken(): string | null
  refreshAccessToken(): Promise<string>
}

const BASE_URL = import.meta.env.VITE_API_URL

let authProvider: HttpAuthProvider | null = null
let refreshRequest: Promise<string> | null = null

export function configureHttpAuth(provider: HttpAuthProvider): void {
  authProvider = provider
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const send = (token: string | null) => {
    const headers = new Headers(options.headers)

    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    })
  }

  let response = await send(authProvider?.getAccessToken() ?? null)

  if (response.status === 401 && retryOnUnauthorized && authProvider) {
    refreshRequest ??= authProvider.refreshAccessToken().finally(() => {
      refreshRequest = null
    })

    const newToken = await refreshRequest
    response = await send(newToken)
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return await response.json() as T
}
