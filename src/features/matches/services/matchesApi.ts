import { httpClient } from '../../../shared/api/httpClient'
import { mapMatchDtoToMatch } from '../adapters/matchAdapter'
import type { CreateMatchFormValues } from '../schemas/createMatchSchema'
import type { CreateMatchPayload, Match, MatchDto } from '../types/match'

export async function getMatches(): Promise<Match[]> {
  const response = await httpClient.get<MatchDto[]>('/matches')
  return response.data.map(mapMatchDtoToMatch)
}

export async function createMatch(values: CreateMatchFormValues): Promise<void> {
  const payload: CreateMatchPayload = {
    player1Id: values.player1Id,
    player2Id: values.player2Id,
    score1: values.score1,
    score2: values.score2,
  }

  await httpClient.post('/matches', payload)
}

