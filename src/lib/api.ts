const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  let response = await fetch(url, defaultOptions);

  if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login' && endpoint !== '/auth/logout') {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        response = await fetch(url, defaultOptions);
      } else {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Session expired');
      }
    } catch (error) {
       window.dispatchEvent(new CustomEvent('auth:unauthorized'));
       throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An unexpected error occurred' };
    }
    throw new Error(errorData.message || response.statusText);
  }

  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  try {
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return {} as T;
  }
}
