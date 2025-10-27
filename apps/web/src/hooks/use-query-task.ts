import type { ITask } from "@repo/core";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api-client";

export function useQueryTask(taskId: string) {
  const result = useQuery({
    queryKey: ['task', taskId],
    queryFn: async (): Promise<ITask> => {
      const { data } = await api.get<ITask>(
        `/tasks/${taskId}`
      )

      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

  return result.data
}