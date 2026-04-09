import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateMatchFormValues } from '../schemas/createMatchSchema'
import { createMatch, getMatches } from '../services/matchesApi'

const MATCHES_QUERY_KEY = ['matches']
const PLAYERS_QUERY_KEY = ['players']

export function useMatchesQuery() {
  return useQuery({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: getMatches,
  })
}

export function useCreateMatchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateMatchFormValues) => createMatch(values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY }),
      ])
    },
  })
}

