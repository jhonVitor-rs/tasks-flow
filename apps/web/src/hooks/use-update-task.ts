import type { IUpdatedTask } from '@repo/core';
import { useMutation } from "@tanstack/react-query";
import api from '../utils/api-client';

export function useUpdateTask() {
  return useMutation({
    mutationFn: async (taskData: IUpdatedTask):Promise<{ id: string }> => {
      const { data } = await api.patch<{ id: string }>(
        `/tasks/${taskData.id}`,
        taskData
      )
      return data
    }
  })
}