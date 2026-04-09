import { z } from 'zod'

export const createPlayerSchema = z.object({
  nickname: z.string().trim().min(2, 'Le pseudo doit contenir au moins 2 caracteres'),
  level: z.number().int().min(0, 'Le niveau doit etre superieur ou egal a 0'),
})

export type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>
