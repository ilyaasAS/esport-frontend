import { toAppApiError } from '../../../shared/api/errorMapper'
import { useAuth } from '../../auth/context/AuthContext'
import { CreatePlayerForm } from '../components/CreatePlayerForm'
import { PlayersList } from '../components/PlayersList'
import { usePlayersQuery } from '../hooks/usePlayers'

export function PlayersPage() {
  const playersQuery = usePlayersQuery()
  const { isAuthenticated } = useAuth()

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100 md:text-3xl">Gestion des joueurs</h1>
        <p className="text-sm text-slate-400 md:text-base">
          Inscris des compétiteurs et suis leur niveau ainsi que leur score.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {isAuthenticated ? (
          <CreatePlayerForm />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-arena-900 p-4 text-sm text-slate-300">
            Connecte-toi pour inscrire un compétiteur.
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-100">Liste des joueurs</h2>

          {playersQuery.isLoading ? (
            <div className="rounded-xl border border-slate-800 bg-arena-900 p-4 text-sm text-slate-400">
              Chargement des joueurs...
            </div>
          ) : null}

          {playersQuery.isError ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {toAppApiError(playersQuery.error).message}
            </div>
          ) : null}

          {playersQuery.data ? <PlayersList players={playersQuery.data} /> : null}
        </div>
      </div>
    </section>
  )
}
