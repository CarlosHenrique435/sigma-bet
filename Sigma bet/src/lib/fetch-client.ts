export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok) {
    return { success: false, error: json.error ?? "Erro na requisição" };
  }

  return { success: true, data: json.data };
}
