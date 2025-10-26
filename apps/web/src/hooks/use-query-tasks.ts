import api from "../utils/api-client";
import qs from "qs";
import type { IBasicTask, IPagination, ITasksQuery } from "@repo/core";
import { useTaskQuery, useTasksActions } from "../stores/tasks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useQueryTasks() {
  const query = useTaskQuery()
  const { setApiData, setApiLoading } = useTasksActions()

  const result = useQuery({
    queryKey: ['tasks', query],
    queryFn: async () => fetchTasks(query),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (result.data) {
      setApiData(result.data)
    }
    setApiLoading(result.isLoading)
  }, [result.data, result.isLoading, setApiData, setApiLoading])

  return result
}

async function fetchTasks(query: ITasksQuery): Promise<IPagination<IBasicTask>> {
  const queryString = qs.stringify(query, { arrayFormat: "brackets" });
  const { data } = await api.get<IPagination<IBasicTask>>(`/tasks?${queryString}`)
  return data
}
