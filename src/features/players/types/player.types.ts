export type Player = {
  id: number
  nickname: string
  level: number
  score: number
}

export type PlayerDto = {
  id: number
  nickname: string
  level: number
  score: number
}

export type CreatePlayerPayload = {
  nickname: string
  level: number
}
