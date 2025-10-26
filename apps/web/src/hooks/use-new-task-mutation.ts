import type { ICreateTask } from "@repo/core";
import { useMutation } from "@tanstack/react-query";
import api from "../utils/api-client";

export function useNewTaskMutation() {
  return useMutation({
    mutationFn: async (dataTask: ICreateTask): Promise<{ id: string }> => {
      const { data } = await api.post<{ id: string }>(
        "/tasks",
        dataTask
      )
      return data
    }
  })
}
