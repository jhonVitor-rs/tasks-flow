import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaskStatus } from "../constants/task-status";
import type { TaskPriority } from "../constants/task-priority";

type TermFilter = {
  gte: Date,
  lte: Date | null
}

type Filters = {
  input: string | null,
  status: TaskStatus | null,
  priority: TaskPriority | null,
  termInterval: TermFilter | null
}

type Pagination = {
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Task = {
  id: string,
  title: string,
  status: TaskStatus,
  priority: TaskPriority,
  term: Date,
  comments: number
}

interface TaskState {
  tasks: Task[],
  filters: Filters,
  pagination: Pagination,

  actions: {
    setTasks: (tasks: Task[]) => void
    addTask: (task: Task) => void
    updateTask: (task: Task) => void
    removeTask: (id: string) => void
    setInputFilter: (input: string | null) => void
    setStatusFilter: (status: TaskStatus | null) => void
    setPriorityFilter: (priority: TaskPriority | null) => void
    setTermFilter: (term: TermFilter | null) => void
    setPage: (page: number) => void
    setPageSize: (pageSize: number) => void
    setPagination: (pagination: Pagination) => void
  }
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      filters: {
        input: null,
        status: null,
        priority: null,
        termInterval: null
      },
      pagination: {
        page: 1,
        pageSize: 5,
        totalPages: 1
      },
      actions: {
        setTasks: (tasks) => set({tasks: [...tasks]}),
        addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
        updateTask: (task) => set((s) => ({ tasks: s.tasks.map((t) => t.id === task.id ? task : t) })),
        removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

        setInputFilter: (input) => set((s) => ({ filters: { ...s.filters, input } })),
        setStatusFilter: (status) => set((s) => ({ filters: { ...s.filters, status } })),
        setPriorityFilter: (priority) => set((s) => ({ filters: { ...s.filters, priority } })),
        setTermFilter: (term) => set((s) => ({ filters: { ...s.filters, termInterval: term } })),

        setPage: (page) => set((s) => ({ pagination: { ...s.pagination, page } })),
        setPageSize: (pageSize) => set((s) => ({ pagination: { ...s.pagination, pageSize } })),
        setPagination: (pagination) => set({pagination})
      }
    }),
    {
      name: "task-store",
      partialize: (state) => ({
        tasks: state.tasks,
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
)


export const useTasks = () => useTaskStore((state) => state.tasks)
export const useTasksFilters = () => useTaskStore((state) => state.filters)
export const useTasksPagination = () => useTaskStore((state) => state.pagination)
export const useTasksActions = () => useTaskStore((state) => state.actions)

export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Implement login with JWT refresh flow",
    status: "in_progress",
    priority: "high",
    term: new Date("2025-10-16"),
    comments: 3,
  },
  {
    id: "2",
    title: "Create Kanban view for tasks",
    status: "todo",
    priority: "medium",
    term: new Date("2025-10-20"),
    comments: 1,
  },
  {
    id: "3",
    title: "Refactor Zustand task store",
    status: "review",
    priority: "low",
    term: new Date("2025-10-14"),
    comments: 4,
  },
  {
    id: "4",
    title: "Fix API CORS issue in dev environment",
    status: "done",
    priority: "urgent",
    term: new Date("2025-10-12"),
    comments: 2,
  },
  {
    id: "5",
    title: "Add pagination to task list endpoint",
    status: "in_progress",
    priority: "medium",
    term: new Date("2025-10-18"),
    comments: 0,
  },
  {
    id: "6",
    title: "Integrate Tanstack Table sorting and filters",
    status: "todo",
    priority: "high",
    term: new Date("2025-10-25"),
    comments: 1,
  },
  {
    id: "7",
    title: "Add color-coded deadline display",
    status: "review",
    priority: "low",
    term: new Date("2025-10-15"),
    comments: 5,
  },
  {
    id: "8",
    title: "Improve mobile layout for Kanban view",
    status: "in_progress",
    priority: "medium",
    term: new Date("2025-10-22"),
    comments: 3,
  },
  {
    id: "9",
    title: "Add calendar synchronization with Google Calendar",
    status: "todo",
    priority: "urgent",
    term: new Date("2025-10-19"),
    comments: 7,
  },
  {
    id: "10",
    title: "Write integration tests for task endpoints",
    status: "done",
    priority: "low",
    term: new Date("2025-10-10"),
    comments: 2,
  },
];
