import type { Player } from '../types/player.types'

type PlayersListProps = {
  players: Player[]
}

export function PlayersList({ players }: PlayersListProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-arena-900 p-4 text-sm text-slate-400">
        Aucun joueur enregistre.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-arena-900">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Pseudo</th>
            <th className="px-4 py-3">Niveau</th>
            <th className="px-4 py-3">Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="border-t border-slate-800 text-slate-200">
              <td className="px-4 py-3">{player.nickname}</td>
              <td className="px-4 py-3">{player.level}</td>
              <td className="px-4 py-3">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
