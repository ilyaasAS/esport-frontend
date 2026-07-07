import type { Match } from '../types/match.types'

type MatchesListProps = {
  matches: Match[]
}

export function MatchesList({ matches }: MatchesListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-arena-900 p-4 text-sm text-slate-400">
        Aucun match enregistré. Enregistre le premier résultat.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <article
          key={match.id}
          className="rounded-xl border border-slate-800 bg-arena-900 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">{match.date}</p>
              <p className="text-sm text-slate-200">
                <span className="font-semibold text-slate-100">{match.player1Nickname}</span>{' '}
                <span className="text-slate-500">contre</span>{' '}
                <span className="font-semibold text-slate-100">{match.player2Nickname}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-arena-950 px-3 py-2">
              <Score value={match.score1} highlight={match.score1 > match.score2} />
              <span className="text-slate-600">:</span>
              <Score value={match.score2} highlight={match.score2 > match.score1} />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function Score({ value, highlight }: { value: number; highlight: boolean }) {
  return (
    <span className={highlight ? 'font-semibold text-neon-400' : 'font-medium text-slate-200'}>
      {value}
    </span>
  )
}

