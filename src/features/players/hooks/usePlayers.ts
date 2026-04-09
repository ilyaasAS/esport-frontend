import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreatePlayerFormValues } from '../schemas/createPlayerSchema'
import { createPlayer, getPlayers } from '../services/playersApi'

const PLAYERS_QUERY_KEY = ['players']

export function usePlayersQuery() {
  return useQuery({
    queryKey: PLAYERS_QUERY_KEY,
    queryFn: getPlayers,
  })
}

export function useCreatePlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreatePlayerFormValues) => createPlayer(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY })
    },
  })
}
