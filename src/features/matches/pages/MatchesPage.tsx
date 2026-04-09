import { toAppApiError } from '../../../shared/api/errorMapper'
import { useAuth } from '../../auth/context/AuthContext'
import { CreateMatchForm } from '../components/CreateMatchForm'
import { MatchesList } from '../components/MatchesList'
import { useMatchesQuery } from '../hooks/useMatches'

export function MatchesPage() {
  const matchesQuery = useMatchesQuery()
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100 md:text-3xl">Matchs</h1>
        <p className="text-sm text-slate-400 md:text-base">
          Enregistre les affrontements et consulte l'historique des scores.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {isAdmin ? (
          <CreateMatchForm />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-arena-900 p-4 text-sm text-slate-300">
            Seuls les administrateurs peuvent enregistrer un affrontement.
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-100">Historique</h2>

          {matchesQuery.isLoading ? (
            <div className="rounded-xl border border-slate-800 bg-arena-900 p-4 text-sm text-slate-400">
              Chargement des matchs...
            </div>
          ) : null}

          {matchesQuery.isError ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {toAppApiError(matchesQuery.error).message}
            </div>
          ) : null}

          {matchesQuery.data ? <MatchesList matches={matchesQuery.data} /> : null}
        </div>
      </div>
    </section>
  )
}

