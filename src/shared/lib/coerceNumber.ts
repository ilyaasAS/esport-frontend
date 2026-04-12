/**
 * Extrait un nombre affichable pour les KPI (total score, compteurs, etc.).
 * Gère nombre brut, DTO { totalScore }, et variante { TotalScore } (sérialisation).
 */
export function resolveKpiNumericValue(data: unknown): number {
  if (typeof data === 'number' && Number.isFinite(data)) {
    return data
  }
  if (data !== null && typeof data === 'object') {
    const o = data as Record<string, unknown>
    const raw = o.totalScore ?? o.TotalScore
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return raw
    }
    if (typeof raw === 'string' && raw.trim() !== '') {
      const n = Number(raw)
      if (Number.isFinite(n)) {
        return n
      }
    }
  }
  return 0
}

/** @deprecated alias de {@link resolveKpiNumericValue} */
export const coerceToFiniteNumber = resolveKpiNumericValue
