export type Match = {
  id: number
  player1Id: number
  player1Nickname: string
  player2Id: number
  player2Nickname: string
  score1: number
  score2: number
  date: string
}

export type MatchDto = {
  id: number
  player1Id: number
  player1Nickname: string
  player2Id: number
  player2Nickname: string
  scorePlayer1: number
  scorePlayer2: number
  date: string
}

export type CreateMatchPayload = {
  player1Id: number
  player2Id: number
  score1: number
  score2: number
}
