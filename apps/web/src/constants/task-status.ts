export const TASK_STATUSES = ["todo", "in_progress", "review", "done"] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

export function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus);
}
