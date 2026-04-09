import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toAppApiError } from '../../../shared/api/errorMapper'
import type { AppApiError } from '../../../shared/api/types'
import { createPlayerSchema } from '../schemas/createPlayerSchema'
import type { CreatePlayerFormValues } from '../schemas/createPlayerSchema'
import { useCreatePlayerMutation } from '../hooks/usePlayers'
import type { UseFormSetError } from 'react-hook-form'

type CreatePlayerFormProps = {
  onCreated?: () => void
}

export function CreatePlayerForm({ onCreated }: CreatePlayerFormProps) {
  const mutation = useCreatePlayerMutation()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlayerFormValues>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      nickname: '',
      level: 1,
    },
  })

  const submit = async (values: CreatePlayerFormValues) => {
    try {
      await mutation.mutateAsync(values)
      reset({ nickname: '', level: 1 })
      onCreated?.()
    } catch (error) {
      const appError = toAppApiError(error)
      mapApiErrorToForm(appError, setError)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 rounded-xl border border-slate-800 bg-arena-900 p-4"
    >
      <h2 className="text-lg font-semibold text-slate-100">Inscrire un joueur</h2>

      <div className="space-y-1">
        <label htmlFor="nickname" className="text-sm text-slate-300">
          Pseudo
        </label>
        <input
          id="nickname"
          type="text"
          placeholder="ShadowStrike"
          className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400"
          {...register('nickname')}
        />
        {errors.nickname ? <p className="text-xs text-red-400">{errors.nickname.message}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="level" className="text-sm text-slate-300">
          Niveau
        </label>
        <input
          id="level"
          type="number"
          min={0}
          className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400"
          {...register('level', { valueAsNumber: true })}
        />
        {errors.level ? <p className="text-xs text-red-400">{errors.level.message}</p> : null}
      </div>

      {errors.root?.message ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errors.root.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="w-full rounded-md bg-neon-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Enregistrement...' : 'Inscrire un joueur'}
      </button>
    </form>
  )
}

function mapApiErrorToForm(
  appError: AppApiError,
  setError: UseFormSetError<CreatePlayerFormValues>,
) {
  if (appError.details?.nickname) {
    setError('nickname', { message: appError.details.nickname })
    return
  }

  if (appError.details?.level) {
    setError('level', { message: appError.details.level })
    return
  }

  setError('root', { message: appError.message })
}
