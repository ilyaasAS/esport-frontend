import { readAuthToken } from '../../features/auth/services/authStorage'
import { getApiRootUrl } from './apiBaseUrl'

/**
 * Requêtes de récupération vers l'API pour des réponses en flux (données fragmentées).
 * Aucun délai d'expiration implicite : les flux IA peuvent durer indéfiniment côté navigateur.
 * Utiliser `response.body` (flux lisible) ou `response.text()` selon le contrat du point d'accès.
 */
// REMARQUE IMPORTANTE : Ne jamais ajouter de délai d'expiration ici pour permettre à l'Oracle de répondre sans limite de temps.
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
