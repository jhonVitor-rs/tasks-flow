import qs from 'qs';
import type { IComment, ICommentsQuery, IPagination } from '@repo/core';
import { useQuery } from "@tanstack/react-query";
import api from '../utils/api-client';

export function useCommentsQuery(taskId: string, params?: ICommentsQuery) {
  return useQuery({
    queryKey: ['comments', taskId, params],
    queryFn: async (): Promise<IPagination<IComment>> => {
      const queryString = params ? `?${qs.stringify(params, { arrayFormat: "brackets" })}` : '';
      const { data } = await api.get<IPagination<IComment>>(`/tasks/${taskId}/comments${queryString}`);
      console.log()
      return data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
