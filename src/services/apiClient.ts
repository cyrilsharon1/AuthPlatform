const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new Error('Authentication service is not configured. Add VITE_API_BASE_URL to .env.local.')
  const response = await fetch(`${baseUrl}${path}`, {
    ...init, credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...init.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message ?? (response.status === 401 ? 'Those details didn’t match. Check them and try again.' : 'Something went wrong. Please try again.'))
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
