import { create } from "zustand";
import { persist } from "zustand/middleware";

type Pagination = {
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Task = {
  id: string,
  title: string,
  description: string,
  status: "todo" | "in_progress" | "review" | "done",
  priority: "low" | "medium" | "high" | "urgent",
  term: Date,
  comments: number
}

type ViewMode = "table" | "kanban" | "calendar"

interface TaskState {
  tasks: Task[],
  pagination: Pagination,
  viewMode: ViewMode

  actions: {
    setTasks: (tasks: Task[]) => void
    addTask: (task: Task) => void
    updateTask: (task: Task) => void
    removeTask: (id: string) => void
    setViewMode: (view: ViewMode) => void
    setPage: (page: number) => void
    setPageSize: (pageSize: number) => void
    setPagination: (pagination: Pagination) => void
  }
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1
      },
      viewMode: "table",
      actions: {
        setTasks: (tasks) => set({tasks: [...tasks]}),
        addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
        updateTask: (task) => set((s) => ({ tasks: s.tasks.map((t) => t.id === task.id ? task : t) })),
        removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
        setViewMode: (view) => set({ viewMode: view }),
        setPage: (page) => set((s) => ({ pagination: { ...s.pagination, page } })),
        setPageSize: (pageSize) => set((s) => ({ pagination: { ...s.pagination, pageSize } })),
        setPagination: (pagination) => set({pagination})
      }
    }),
    {
      name: "task-store",
      partialize: (state) => ({
        tasks: state.tasks,
        viewMode: state.viewMode,
        pagination: state.pagination
      })
    }
  )
)


export const useTasks = () => useTaskStore((state) => state.tasks)
export const useViewMode = () => useTaskStore((state) => state.viewMode)
export const usePagination = () => useTaskStore((state) => state.pagination)
export const useTasksActions = () => useTaskStore((state) => state.actions)
