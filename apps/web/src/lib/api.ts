import { useAuthStore } from "@/store/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type ApiError = { error?: string };

// Wrapper em volta do fetch que:
// - prefixa a URL base da API
// - envia/recebe cookies (credentials: "include") -> necessário pro refresh token
// - anexa o header Authorization com o access token, se houver
// - já trata JSON e erros
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Algumas respostas podem não ter corpo JSON; protegemos com catch
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data as ApiError).error || "Erro inesperado";
    throw new Error(message);
  }

  return data as T;
}