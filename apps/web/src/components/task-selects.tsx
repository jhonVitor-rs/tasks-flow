import { cn } from "../lib/utils";
import { useTasksActions, type Task } from "../stores/tasks";
import { statusColors, priorityColors } from "../constants/task-colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function StatusTaskSelect({
  task,
  className = "",
}: {
  task: Task;
  className?: string;
}) {
  const { updateTask } = useTasksActions();

  return (
    <Select value={task.status.toString()}>
      <SelectTrigger
        className={cn(statusColors[task.status], "w-full", className)}
      >
        <SelectValue placeholder="Select a task status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="todo"
          className={cn(statusColors["todo"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, status: "todo" })}
        >
          Todo
        </SelectItem>
        <SelectItem
          value="in_progress"
          className={cn(statusColors["in_progress"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, status: "in_progress" })}
        >
          In Progress
        </SelectItem>
        <SelectItem
          value="review"
          className={cn(statusColors["review"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, status: "review" })}
        >
          Review
        </SelectItem>
        <SelectItem
          value="done"
          className={cn(statusColors["done"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, status: "done" })}
        >
          Done
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function PriorityTaskSelect({
  task,
  className = "",
}: {
  task: Task;
  className?: string;
}) {
  const { updateTask } = useTasksActions();

  return (
    <Select value={task.priority.toString()}>
      <SelectTrigger
        className={cn(priorityColors[task.priority], "w-full", className)}
      >
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="low"
          className={cn(priorityColors["low"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, priority: "low" })}
        >
          Low
        </SelectItem>
        <SelectItem
          value="medium"
          className={cn(priorityColors["medium"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, priority: "medium" })}
        >
          Medium
        </SelectItem>
        <SelectItem
          value="high"
          className={cn(priorityColors["high"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, priority: "high" })}
        >
          High
        </SelectItem>
        <SelectItem
          value="urgent"
          className={cn(priorityColors["urgent"], "opacity-70 my-1")}
          onClick={() => updateTask({ ...task, priority: "urgent" })}
        >
          Urgent
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
