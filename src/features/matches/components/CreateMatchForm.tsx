import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toAppApiError } from '../../../shared/api/errorMapper'
import type { AppApiError } from '../../../shared/api/types'
import { usePlayersQuery } from '../../players/hooks/usePlayers'
import { createMatchSchema } from '../schemas/createMatchSchema'
import type { CreateMatchFormValues } from '../schemas/createMatchSchema'
import { useCreateMatchMutation } from '../hooks/useMatches'

export function CreateMatchForm() {
  const playersQuery = usePlayersQuery()
  const mutation = useCreateMatchMutation()

  const options = useMemo(() => {
    const players = playersQuery.data ?? []
    return players.map((p) => ({ value: p.id, label: `${p.nickname} (niveau ${p.level})` }))
  }, [playersQuery.data])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateMatchFormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      player1Id: 0,
      player2Id: 0,
      score1: 0,
      score2: 0,
    },
  })

  const submit = async (values: CreateMatchFormValues) => {
    try {
      await mutation.mutateAsync(values)
      reset({ player1Id: 0, player2Id: 0, score1: 0, score2: 0 })
    } catch (error) {
      mapApiErrorToForm(toAppApiError(error), setError)
    }
  }

  const disabled = isSubmitting || mutation.isPending || playersQuery.isLoading
  const playersReady = options.length >= 2

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 rounded-xl border border-slate-800 bg-arena-900 p-4"
    >
      <h2 className="text-lg font-semibold text-slate-100">Enregistrer un match</h2>

      {playersQuery.isError ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {toAppApiError(playersQuery.error).message}
        </p>
      ) : null}

      {!playersReady && !playersQuery.isLoading ? (
        <p className="rounded-md border border-slate-800 bg-arena-950 px-3 py-2 text-sm text-slate-300">
          Cree au moins <span className="font-semibold text-neon-400">2 joueurs</span> avant
          d'enregistrer un match.
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="player1Id" className="text-sm text-slate-300">
          Joueur 1
        </label>
        <select
          id="player1Id"
          className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400 disabled:opacity-60"
          disabled={disabled || !playersReady}
          {...register('player1Id', { valueAsNumber: true })}
        >
          <option value={0}>Selectionner un joueur</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.player1Id ? <p className="text-xs text-red-400">{errors.player1Id.message}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="player2Id" className="text-sm text-slate-300">
          Joueur 2
        </label>
        <select
          id="player2Id"
          className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400 disabled:opacity-60"
          disabled={disabled || !playersReady}
          {...register('player2Id', { valueAsNumber: true })}
        >
          <option value={0}>Selectionner un joueur</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.player2Id ? <p className="text-xs text-red-400">{errors.player2Id.message}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="score1" className="text-sm text-slate-300">
            Points 1
          </label>
          <input
            id="score1"
            type="number"
            min={0}
            className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400 disabled:opacity-60"
            disabled={disabled || !playersReady}
            {...register('score1', { valueAsNumber: true })}
          />
          {errors.score1 ? <p className="text-xs text-red-400">{errors.score1.message}</p> : null}
        </div>
        <div className="space-y-1">
          <label htmlFor="score2" className="text-sm text-slate-300">
            Points 2
          </label>
          <input
            id="score2"
            type="number"
            min={0}
            className="w-full rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400 disabled:opacity-60"
            disabled={disabled || !playersReady}
            {...register('score2', { valueAsNumber: true })}
          />
          {errors.score2 ? <p className="text-xs text-red-400">{errors.score2.message}</p> : null}
        </div>
      </div>

      {errors.root?.message ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errors.root.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={disabled || !playersReady}
        className="w-full rounded-md bg-neon-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Enregistrement...' : 'Enregistrer un match'}
      </button>
    </form>
  )
}

function mapApiErrorToForm(
  appError: AppApiError,
  setError: ReturnType<typeof useForm<CreateMatchFormValues>>['setError'],
) {
  if (appError.details?.player1Id) {
    setError('player1Id', { message: appError.details.player1Id })
    return
  }
  if (appError.details?.player2Id) {
    setError('player2Id', { message: appError.details.player2Id })
    return
  }
  if (appError.details?.score1) {
    setError('score1', { message: appError.details.score1 })
    return
  }
  if (appError.details?.score2) {
    setError('score2', { message: appError.details.score2 })
    return
  }

  setError('root', { message: appError.message })
}

