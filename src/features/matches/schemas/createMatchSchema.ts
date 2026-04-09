import { z } from 'zod'

export const createMatchSchema = z
  .object({
    player1Id: z.number().int().min(1, 'Le joueur 1 est requis'),
    player2Id: z.number().int().min(1, 'Le joueur 2 est requis'),
    score1: z.number().int().min(0, 'Les points 1 doivent etre >= 0'),
    score2: z.number().int().min(0, 'Les points 2 doivent etre >= 0'),
  })
  .superRefine((values, ctx) => {
    if (values.player1Id === values.player2Id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les joueurs doivent etre differents',
        path: ['player2Id'],
      })
    }
  })

export type CreateMatchFormValues = z.infer<typeof createMatchSchema>

