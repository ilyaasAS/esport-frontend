import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères."),
  password: z.string().min(1, 'Le mot de passe est obligatoire.'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères."),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.',
    ),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
