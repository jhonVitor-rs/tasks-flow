import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IBasicTask, IPagination, ITasksQuery, TaskQueryOrder } from "@repo/core";

interface TaskState {
  query: ITasksQuery,
  apiData: IPagination<IBasicTask>,
  apiLoading: boolean,

  actions: {
    setApiData: (data: IPagination<IBasicTask>) => void
    addTask: (task: IBasicTask) => void
    removeTask: (id: string) => void
    updateSort: (orderBy?: TaskQueryOrder, order?: 'ASC' | 'DESC') => void;
    setQuery: (query: ITasksQuery) => void
    setApiLoading: (load: boolean) => void
  }
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      query: {
        page: 1,
        size: 10,
        title: undefined,
        status: undefined,
        priority: undefined,
        termInterval: undefined,
        orderBy: undefined,
        order: undefined
      },
      apiData: {
        data: [],
        page: 1,
        size: 0,
        total: 0,
        totalPages: 1
      },
      apiLoading: false,
      actions: {
        setApiData: (data) => set({apiData: data}),
        addTask: (task) => set((s) => ({apiData: {...s.apiData, data: [...s.apiData.data, task]}})),
        removeTask: (id) => set((s) => ({apiData: {...s.apiData, data: s.apiData.data.filter((d) => d.id !== id)}})),
        setQuery: (query) => set({ query: query }),
        updateSort: (orderBy, order) =>
          set((s) => ({
            query: {
              ...s.query,
              orderBy,
              order,
              page: 1,
            },
          })),
        setApiLoading: (load) => set({apiLoading: load})
      }
    }),
    {
      name: "task-store",
      partialize: (state) => ({
        apiData: state.apiData,
        query: state.query
      })
    }
  )
)


export const useTasks = () => useTaskStore((state) => state.apiData.data)
export const useApiData = () => useTaskStore((state) => state.apiData)
export const useTaskQuery = () => useTaskStore((state) => state.query)
export const useApiLoading = () => useTaskStore((state) => state.apiLoading)
export const useTasksActions = () => useTaskStore((state) => state.actions)
