import type { Task } from "../stores/tasks";

export const statusColors: Record<Task["status"], string> = {
  todo: "bg-amber-200 text-amber-900 border border-amber-400",
  in_progress: "bg-indigo-200 text-indigo-900 border border-indigo-400",
  review: "bg-fuchsia-200 text-fuchsia-900 border border-fuchsia-400",
  done: "bg-green-200 text-green-900 border border-green-400",
};

export const priorityColors: Record<Task["priority"], string> = {
  low: "bg-emerald-100 text-emerald-900 border border-emerald-400",
  medium: "bg-amber-100 text-amber-900 border border-amber-400",
  high: "bg-orange-100 text-orange-900 border border-orange-400",
  urgent: "bg-red-100 text-red-900 border border-red-400",
};
