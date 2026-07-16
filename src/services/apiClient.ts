const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, options);

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    const message = errorBody?.message || `Erro ${response.status} ao acessar a API.`;

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
