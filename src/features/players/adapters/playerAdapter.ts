import type { CreatePlayerFormValues } from '../schemas/createPlayerSchema'
import type { CreatePlayerPayload, Player, PlayerDto } from '../types/player'

export function mapPlayerDtoToPlayer(dto: PlayerDto): Player {
  return {
    id: dto.id,
    nickname: dto.nickname,
    level: dto.level,
    score: dto.score,
  }
}

export function mapCreatePlayerFormToPayload(
  values: CreatePlayerFormValues,
): CreatePlayerPayload {
  return {
    nickname: values.nickname.trim(),
    level: values.level,
  }
}
