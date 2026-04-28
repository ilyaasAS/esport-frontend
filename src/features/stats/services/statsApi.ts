import { httpClient } from '../../../shared/api/httpClient'
import { resolveKpiNumericValue } from '../../../shared/lib/coerceNumber'
import { mapPlayerDtoToPlayer } from '../../players/adapters/playerAdapter'
import type { Player, PlayerDto } from '../../players/types/player.types'

export async function getTop3Players(): Promise<Player[]> {
  const response = await httpClient.get<PlayerDto[]>('/stats/top-3')
  return response.data.map(mapPlayerDtoToPlayer)
}

/** Réponse backend : record `TotalScoreDTO` → `{ "totalScore": number }` */
export async function getTotalScore(): Promise<number> {
  const response = await httpClient.get<unknown>('/stats/total-score')
  return resolveKpiNumericValue(response.data)
}

