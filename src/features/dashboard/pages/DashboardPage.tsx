import { Crown, Medal, Swords, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resolveKpiNumericValue } from '../../../shared/lib/coerceNumber'
import { isAxiosUnauthorized } from '../../../shared/lib/httpError'
import { useMatchesCountQuery, useTop3PlayersQuery, useTotalScoreQuery } from '../../stats/hooks/useStats'

export function DashboardPage() {
  const top3Query = useTop3PlayersQuery()
  const totalScoreQuery = useTotalScoreQuery()
  const matchesCountQuery = useMatchesCountQuery()

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100 md:text-3xl">Tableau de bord</h1>
        <p className="text-sm text-slate-400 md:text-base">
          Vision instantanée de la ligue : classement, activités récentes et score cumulé.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Classement des champions (Top 3)"
          icon={<Crown className="h-4 w-4 text-neon-400" />}
          body={
            top3Query.isLoading ? (
              <div className="space-y-3">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            ) : top3Query.isError ? (
              <StatsQueryErrorMessage error={top3Query.error} />
            ) : (
              <ol className="space-y-2">
                {(Array.isArray(top3Query.data) ? top3Query.data : []).map((p, index) => {
                  const row = normalizeTop3Row(p, index)
                  return (
                  <li
                    key={row.id}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-arena-950 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <MedalIcon rank={index + 1} />
                      <span className="text-sm font-semibold text-slate-100">{row.nickname}</span>
                      <span className="text-xs text-slate-500">Niveau {row.level}</span>
                    </div>
                    <span className="text-sm font-semibold text-neon-400">{row.score}</span>
                  </li>
                  )
                })}
                {(Array.isArray(top3Query.data) ? top3Query.data : []).length === 0 ? (
                  <p className="text-sm text-slate-400">Aucun joueur enregistré.</p>
                ) : null}
              </ol>
            )
          }
        />

        <KpiCard
          title="Score Total de la Ligue"
          icon={<Trophy className="h-4 w-4 text-neon-400" />}
          body={
            totalScoreQuery.isLoading ? (
              <div className="space-y-3">
                <SkeletonBlock />
                <SkeletonLine className="w-2/3" />
              </div>
            ) : totalScoreQuery.isError ? (
              <StatsQueryErrorMessage error={totalScoreQuery.error} />
            ) : (
              <div className="space-y-1">
                <p className="text-3xl font-semibold tracking-tight text-slate-100">
                  {resolveKpiNumericValue(totalScoreQuery.data)}
                </p>
                <p className="text-sm text-slate-400">Total des points générés par les matchs.</p>
              </div>
            )
          }
        />

        <KpiCard
          title="Dernières activités"
          icon={<Swords className="h-4 w-4 text-neon-400" />}
          body={
            matchesCountQuery.isLoading ? (
              <div className="space-y-3">
                <SkeletonBlock />
                <SkeletonLine className="w-3/4" />
              </div>
            ) : matchesCountQuery.isError ? (
              <StatsQueryErrorMessage error={matchesCountQuery.error} />
            ) : (
              <div className="space-y-1">
                <p className="text-3xl font-semibold tracking-tight text-slate-100">
                  {resolveKpiNumericValue(matchesCountQuery.data)}
                </p>
                <p className="text-sm text-slate-400">Matchs enregistrés dans la ligue.</p>
              </div>
            )
          }
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-arena-900 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Actions rapides</h2>
        <p className="mt-1 text-sm text-slate-400">
          Agis rapidement : inscris des joueurs et enregistre les résultats.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <QuickAction
            to="/players"
            title="Inscrire un joueur"
            description="Enregistrer un nouveau compétiteur."
            icon={<Users className="h-4 w-4 text-neon-400" />}
          />
          <QuickAction
            to="/matches"
            title="Enregistrer un match"
            description="Enregistrer le résultat d'un nouveau match."
            icon={<Medal className="h-4 w-4 text-neon-400" />}
          />
        </div>
      </div>
    </section>
  )
}

function StatsQueryErrorMessage({ error }: { error: unknown }) {
  if (isAxiosUnauthorized(error)) {
    return (
      <div className="space-y-2 rounded-lg border border-neon-400/25 bg-arena-950/90 p-3 text-sm leading-relaxed text-slate-200">
        <p>
          Connectez-vous pour consulter ces statistiques. Si vous n&apos;avez pas encore de compte, vous pouvez en
          créer un gratuitement.
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <Link to="/login" className="font-medium text-neon-400 underline-offset-2 hover:underline">
            Se connecter
          </Link>
          <span className="text-slate-500">·</span>
          <Link to="/register" className="font-medium text-neon-400 underline-offset-2 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    )
  }
  return <p className="text-sm text-red-300">Échec de la connexion aux données.</p>
}

function KpiCard({
  title,
  icon,
  body,
}: {
  title: string
  icon: React.ReactNode
  body: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-arena-900 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <div className="rounded-md border border-slate-800 bg-arena-950 p-2">{icon}</div>
      </div>
      <div className="mt-4">{body}</div>
    </div>
  )
}

function QuickAction({
  to,
  title,
  description,
  icon,
}: {
  to: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-arena-950 p-4 transition hover:border-neon-400/50 hover:bg-slate-900/60"
    >
      <div className="rounded-md border border-slate-800 bg-arena-900 p-2">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </Link>
  )
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={['h-3 w-full animate-pulse rounded bg-slate-800/80', className].filter(Boolean).join(' ')} />
  )
}

function SkeletonBlock() {
  return <div className="h-10 w-24 animate-pulse rounded bg-slate-800/80" />
}

type Top3Row = { id: number; nickname: string; level: number; score: number }

function normalizeTop3Row(entry: unknown, fallbackIndex: number): Top3Row {
  if (!entry || typeof entry !== 'object') {
    return { id: fallbackIndex, nickname: '—', level: 0, score: 0 }
  }
  const o = entry as Record<string, unknown>
  const nickname = typeof o.nickname === 'string' ? o.nickname : '—'
  return {
    id: typeof o.id === 'number' && Number.isFinite(o.id) ? o.id : fallbackIndex,
    nickname,
    level: resolveKpiNumericValue(o.level),
    score: resolveKpiNumericValue(o.score),
  }
}

function MedalIcon({ rank }: { rank: number }) {
  const color =
    rank === 1 ? 'text-amber-300' : rank === 2 ? 'text-slate-200' : 'text-orange-300'

  return (
    <span className="inline-flex items-center gap-1">
      <Medal className={['h-4 w-4', color].join(' ')} />
      <span className="text-xs text-slate-400">#{rank}</span>
    </span>
  )
}
