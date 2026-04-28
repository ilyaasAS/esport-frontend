import type { AuthState } from '../types/auth.types'

const AUTH_STORAGE_KEY = 'esport.auth'

export function saveAuthState(authState: AuthState): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
}

export function readAuthState(): AuthState | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthState>
    if (
      typeof parsed.token === 'string' &&
      parsed.token.length > 0 &&
      parsed.user &&
      typeof parsed.user.username === 'string' &&
      (parsed.user.role === 'USER' || parsed.user.role === 'ADMIN')
    ) {
      return {
        token: parsed.token,
        user: {
          username: parsed.user.username,
          role: parsed.user.role,
        },
      }
    }
  } catch {
    // On ignore les données corrompues pour éviter de bloquer le démarrage.
  }

  clearAuthState()
  return null
}

/** Supprime l’état d’auth (JWT + profil) du stockage navigateur — à appeler à la déconnexion. */
export function clearAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function readAuthToken(): string | null {
  return readAuthState()?.token ?? null
}
