import { useQuery } from '@tanstack/react-query'
import { getMatches } from '../../matches/services/matchesApi'
import { getTop3Players, getTotalScore } from '../services/statsApi'

export function useTop3PlayersQuery() {
  return useQuery({
    queryKey: ['stats', 'top-3'],
    queryFn: getTop3Players,
  })
}

export function useTotalScoreQuery() {
  return useQuery({
    queryKey: ['stats', 'total-score'],
    queryFn: getTotalScore,
  })
}

export function useMatchesCountQuery() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
    select: (matches) => matches.length,
  })
}

