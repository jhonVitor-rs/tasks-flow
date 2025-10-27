import type { IUser } from "@repo/core";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api-client";

export function useQueryUsers() {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<IUser[]> => {
      const { data } = await api.get<IUser[]>(
        '/auth/all_users'
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

  return result.data || []
}