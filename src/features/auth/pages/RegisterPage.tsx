import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas'
import { toAppApiError } from '../../../shared/api/errorMapper'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerAccount, isAuthenticated } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const submit = async (values: RegisterFormValues) => {
    try {
      await registerAccount(values)
      navigate('/', { replace: true })
    } catch (error) {
      const appError = toAppApiError(error)
      setError('root', { message: appError.message || "Impossible de créer le compte." })
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-arena-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-arena-900 p-6 shadow-xl shadow-black/20">
        <h1 className="text-2xl font-semibold text-slate-100">Inscription</h1>
        <p className="mt-1 text-sm text-slate-400">
          Crée un compte pour accéder aux fonctionnalités sécurisées.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
          <div className="space-y-1">
            <label htmlFor="username" className="text-sm text-slate-300">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              placeholder="ex: ArenaMaster"
              className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400"
              {...register('username')}
            />
            {errors.username ? <p className="text-xs text-red-400">{errors.username.message}</p> : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-slate-300">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="8 caractères minimum"
              className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400"
              {...register('password')}
            />
            {errors.password ? <p className="text-xs text-red-400">{errors.password.message}</p> : null}
          </div>

          {errors.root?.message ? (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errors.root.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-neon-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-medium text-neon-400 hover:text-sky-300">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  )
}
