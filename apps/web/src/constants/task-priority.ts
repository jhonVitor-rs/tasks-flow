import type { TaskPriority } from "@repo/core"

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const

export function isTaskPriority(value: string): value is TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority)
}
