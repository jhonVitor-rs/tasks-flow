import type { ICreateComment } from "@repo/core";
import { useMutation } from "@tanstack/react-query";
import api from "../utils/api-client";

export function useCommentMutation(taskId: string) {
  return useMutation({
    mutationFn: async (commentData: ICreateComment): Promise<{id: string}> => {
      const { data } = await api.post<{id: string}>(
        `/tasks/${taskId}/comments`,
        commentData
      )
      return data
    }
  })
}