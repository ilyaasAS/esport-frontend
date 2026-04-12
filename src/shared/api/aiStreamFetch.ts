import { readAuthToken } from '../../features/auth/services/authStorage'
import { getApiRootUrl } from './apiBaseUrl'

/**
 * Requêtes `fetch` vers l’API pour réponses en flux (NDJSON, SSE, chunked).
 * Aucun timeout implicite : les streams IA peuvent durer indéfiniment côté navigateur.
 * Utiliser `response.body` (ReadableStream) ou `response.text()` selon le contrat d’endpoint.
 */
// IMPORTANT: Ne jamais ajouter de timeout ici pour permettre à l'Oracle de répondre sans limite de temps.
export async function aiStreamFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiRootUrl()
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`

  const headers = new Headers(init.headers)
  const token = readAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(url, {
    ...init,
    headers,
  })
}
