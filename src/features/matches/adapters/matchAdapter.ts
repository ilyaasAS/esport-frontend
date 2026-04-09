import type { Match, MatchDto } from '../types/match'

export function mapMatchDtoToMatch(dto: MatchDto): Match {
  return {
    id: dto.id,
    player1Id: dto.player1Id,
    player1Nickname: dto.player1Nickname,
    player2Id: dto.player2Id,
    player2Nickname: dto.player2Nickname,
    score1: dto.scorePlayer1,
    score2: dto.scorePlayer2,
    date: dto.date,
  }
}
