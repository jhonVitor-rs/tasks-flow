import { useMutation } from "@tanstack/react-query";
import api from "../utils/api-client";

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (taskId: string): Promise<{success: boolean}> => {
      const { data } = await api.delete<{success: boolean}>(
        `/tasks/${taskId}`
      )

      return data
    }
  })
}