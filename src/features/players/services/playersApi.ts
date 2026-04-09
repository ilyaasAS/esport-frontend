import { httpClient } from '../../../shared/api/httpClient'
import { mapCreatePlayerFormToPayload, mapPlayerDtoToPlayer } from '../adapters/playerAdapter'
import type { CreatePlayerFormValues } from '../schemas/createPlayerSchema'
import type { Player, PlayerDto } from '../types/player'

export async function getPlayers(): Promise<Player[]> {
  const response = await httpClient.get<PlayerDto[]>('/players')
  return response.data.map(mapPlayerDtoToPlayer)
}

export async function createPlayer(values: CreatePlayerFormValues): Promise<void> {
  const payload = mapCreatePlayerFormToPayload(values)
  await httpClient.post('/players', payload)
}
