import { Crown, Medal, Swords, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
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
          Vision instantanee de la ligue : classement, activites recentes et score cumule.
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
              <p className="text-sm text-red-300">Echec de la connexion aux donnees.</p>
            ) : (
              <ol className="space-y-2">
                {(top3Query.data ?? []).map((p, index) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-arena-950 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <MedalIcon rank={index + 1} />
                      <span className="text-sm font-semibold text-slate-100">{p.nickname}</span>
                      <span className="text-xs text-slate-500">Niveau {p.level}</span>
                    </div>
                    <span className="text-sm font-semibold text-neon-400">{p.score}</span>
                  </li>
                ))}
                {(top3Query.data ?? []).length === 0 ? (
                  <p className="text-sm text-slate-400">Aucun joueur enregistre.</p>
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
              <p className="text-sm text-red-300">Echec de la connexion aux donnees.</p>
            ) : (
              <div className="space-y-1">
                <p className="text-3xl font-semibold tracking-tight text-slate-100">
                  {totalScoreQuery.data ?? 0}
                </p>
                <p className="text-sm text-slate-400">Total des points generes par les matchs.</p>
              </div>
            )
          }
        />

        <KpiCard
          title="Dernieres activites"
          icon={<Swords className="h-4 w-4 text-neon-400" />}
          body={
            matchesCountQuery.isLoading ? (
              <div className="space-y-3">
                <SkeletonBlock />
                <SkeletonLine className="w-3/4" />
              </div>
            ) : matchesCountQuery.isError ? (
              <p className="text-sm text-red-300">Echec de la connexion aux donnees.</p>
            ) : (
              <div className="space-y-1">
                <p className="text-3xl font-semibold tracking-tight text-slate-100">
                  {matchesCountQuery.data ?? 0}
                </p>
                <p className="text-sm text-slate-400">Matchs enregistres dans la ligue.</p>
              </div>
            )
          }
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-arena-900 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Actions rapides</h2>
        <p className="mt-1 text-sm text-slate-400">
          Agis rapidement : inscris des joueurs et enregistre les resultats.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <QuickAction
            to="/players"
            title="Inscrire un joueur"
            description="Enregistrer un nouveau competiteur."
            icon={<Users className="h-4 w-4 text-neon-400" />}
          />
          <QuickAction
            to="/matches"
            title="Enregistrer un match"
            description="Enregistrer le resultat d'un nouveau match."
            icon={<Medal className="h-4 w-4 text-neon-400" />}
          />
        </div>
      </div>
    </section>
  )
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
