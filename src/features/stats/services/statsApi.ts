import { httpClient } from '../../../shared/api/httpClient'
import { mapPlayerDtoToPlayer } from '../../players/adapters/playerAdapter'
import type { Player, PlayerDto } from '../../players/types/player'

export async function getTop3Players(): Promise<Player[]> {
  const response = await httpClient.get<PlayerDto[]>('/stats/top-3')
  return response.data.map(mapPlayerDtoToPlayer)
}

export async function getTotalScore(): Promise<number> {
  const response = await httpClient.get<number>('/stats/total-score')
  return response.data
}

