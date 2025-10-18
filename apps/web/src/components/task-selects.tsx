import { cn } from "../lib/utils";
import { useTasksActions, type Task } from "../stores/tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  Flag,
  Flame,
} from "lucide-react";

const statusConfig = {
  todo: {
    label: "Todo",
    icon: Circle,
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-700",
    hoverBg: "hover:bg-slate-200 dark:hover:bg-slate-700",
    dot: "bg-slate-500",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-950",
    border: "border-blue-300 dark:border-blue-800",
    hoverBg: "hover:bg-blue-200 dark:hover:bg-blue-900",
    dot: "bg-blue-500",
  },
  review: {
    label: "Review",
    icon: Eye,
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-100 dark:bg-purple-950",
    border: "border-purple-300 dark:border-purple-800",
    hoverBg: "hover:bg-purple-200 dark:hover:bg-purple-900",
    dot: "bg-purple-500",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    color: "text-green-700 dark:text-green-300",
    bg: "bg-green-100 dark:bg-green-950",
    border: "border-green-300 dark:border-green-800",
    hoverBg: "hover:bg-green-200 dark:hover:bg-green-900",
    dot: "bg-green-500",
  },
} as const;

const priorityConfig = {
  low: {
    label: "Low",
    icon: Flag,
    color: "text-gray-700 dark:text-gray-300",
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-300 dark:border-gray-700",
    hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700",
    dot: "bg-gray-500",
  },
  medium: {
    label: "Medium",
    icon: AlertTriangle,
    color: "text-yellow-700 dark:text-yellow-300",
    bg: "bg-yellow-100 dark:bg-yellow-950",
    border: "border-yellow-300 dark:border-yellow-800",
    hoverBg: "hover:bg-yellow-200 dark:hover:bg-yellow-900",
    dot: "bg-yellow-500",
  },
  high: {
    label: "High",
    icon: AlertCircle,
    color: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-950",
    border: "border-orange-300 dark:border-orange-800",
    hoverBg: "hover:bg-orange-200 dark:hover:bg-orange-900",
    dot: "bg-orange-500",
  },
  urgent: {
    label: "Urgent",
    icon: Flame,
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-950",
    border: "border-red-300 dark:border-red-800",
    hoverBg: "hover:bg-red-200 dark:hover:bg-red-900",
    dot: "bg-red-500",
  },
} as const;

export function StatusTaskSelect({
  status,
  className = "",
  changeValue,
}: {
  status: keyof typeof statusConfig;
  className?: string;
  changeValue: (value: "todo" | "in_progress" | "review" | "done") => void;
}) {
  const currentStatus = statusConfig[status || "todo"];

  return (
    <Select value={status} onValueChange={changeValue}>
      <SelectTrigger
        className={cn(
          "h-8 w-[170px] gap-2 border font-medium transition-colors",
          currentStatus.bg,
          currentStatus.color,
          currentStatus.border,
          "hover:opacity-90",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <SelectValue placeholder="Select a task status" />
        </div>
      </SelectTrigger>
      <SelectContent position="popper" className="w-[170px]">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <SelectItem
              key={key}
              value={key}
              className={cn(
                "cursor-pointer transition-colors my-0.5",
                config.color,
                config.hoverBg
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("size-2 rounded-full", config.dot)} />
                <Icon className="size-3.5" />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function TaskStatusSelectAdapter({
  task,
  className = "",
}: {
  task: Task;
  className?: string;
}) {
  const { updateTask } = useTasksActions();

  const handleStatusChange = (value: string) => {
    if (value === task.status) return;
    updateTask({ ...task, status: value as Task["status"] });
  };

  return (
    <StatusTaskSelect
      status={task.status}
      changeValue={handleStatusChange}
      className={className}
    />
  );
}

export function PriorityTaskSelect({
  priority,
  className = "",
  changeValue,
}: {
  priority: keyof typeof priorityConfig;
  className?: string;
  changeValue: (value: "low" | "medium" | "high" | "urgent") => void;
}) {
  const currentPriority = priorityConfig[priority || "low"];

  return (
    <Select value={priority} onValueChange={changeValue}>
      <SelectTrigger
        className={cn(
          "h-8 w-[150px] dap-2 border font-medium transition-colors",
          currentPriority.bg,
          currentPriority.color,
          currentPriority.border,
          "hover:opacity-90",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <SelectValue placeholder="Select priority" />
        </div>
      </SelectTrigger>
      <SelectContent position="popper" className="w-[150px]">
        {Object.entries(priorityConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <SelectItem
              key={key}
              value={key}
              className={cn(
                "cursor-pointer transition-colors my-0.5",
                config.color,
                config.hoverBg
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("size-2 rounded-full", config.dot)} />
                <Icon className="size-3.5" />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function TaskPrioritySelectAdapter({
  task,
  className = "",
}: {
  task: Task;
  className?: string;
}) {
  const { updateTask } = useTasksActions();

  const handlePriorityChange = (value: string) => {
    if (value === task.priority) return;
    updateTask({ ...task, priority: value as Task["priority"] });
  };

  return (
    <PriorityTaskSelect
      priority={task.priority}
      changeValue={handlePriorityChange}
      className={className}
    />
  );
}
