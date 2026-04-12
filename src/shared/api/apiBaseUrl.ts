/**
 * URL racine de l’API REST (schéma + hôte + port + chemin `/api`).
 * Définir `VITE_API_BASE_URL` dans le `.env` du frontend (voir `frontend/.env.example`).
 */
const DEFAULT_API_ROOT = 'http://localhost:8080/api'

export function getApiRootUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/$/, '')
  }
  return DEFAULT_API_ROOT
}
