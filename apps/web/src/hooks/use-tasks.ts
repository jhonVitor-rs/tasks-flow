import client from "../utils/api-client"
import { useTasksFilters, useTasksPagination, useTasksActions } from "../stores/tasks";
import { useCallback, useEffect } from "react";

export function useTasks() {
  const { input, priority, status, termInterval } = useTasksFilters()
  const { page, pageSize } = useTasksPagination()

  const actions = useTasksActions()

  const loadTasks = useCallback(async () => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("size", String(pageSize))

    if (input) params.set("input", input)
    if (priority) params.set("priority", priority)
    if (status) params.set("status", status)
    if (termInterval?.gte) params.set("term_gte", termInterval.gte.toISOString())
    if (termInterval?.lte) params.set("term_lte", termInterval.lte.toISOString())

    try {
      const { data } = await client.get(`/tasks?${params.toString()}`)
      actions.setTasks(data)
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, priority, status, termInterval, page, pageSize])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])
}
