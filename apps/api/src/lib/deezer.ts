const API_BASE = "https://api.deezer.com";

// Cliente da Deezer API (pública, sem autenticação).
// O backend faz o proxy: o frontend chama a NOSSA API, que chama a Deezer.
// Isso evita problemas de CORS (a Deezer não libera chamadas diretas do navegador).
export async function deezerFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    throw new Error(`Deezer API erro (status ${res.status})`);
  }

  const data = await res.json();

  // A Deezer às vezes devolve { error: {...} } com status 200
  if (data && typeof data === "object" && "error" in data && data.error) {
    const message = data.error?.message || "erro desconhecido";
    throw new Error(`Deezer API erro: ${message}`);
  }

  return data as T;
}