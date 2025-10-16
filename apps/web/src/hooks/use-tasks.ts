import client from "../utils/api-client"
import { usePagination, useTasksActions } from "../stores/tasks";
import { useCallback, useEffect } from "react";

export function useTasks() {
  const {page,pageSize} = usePagination()
  const actions = useTasksActions()

  const loadTasks = useCallback(async () => {
    const { data } = await client.get(`/tasks?page=${page}&size=${pageSize}`)
    actions.setTasks(data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])
}
