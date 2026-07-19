const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);

  if (apiBaseUrl.includes("ngrok-free.app")) {
    headers.set("ngrok-skip-browser-warning", "true");
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se o servidor e o túnel estão ativos.",
    );
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    const message = errorBody?.message || `Erro ${response.status} ao acessar a API.`;

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
