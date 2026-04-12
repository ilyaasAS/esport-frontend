import { z } from 'zod'

export const createPlayerSchema = z.object({
  nickname: z.string().trim().min(1, 'Le pseudo est obligatoire.'),
  level: z.number().int().min(0, 'Le niveau doit etre superieur ou egal a 0'),
})

export type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>
