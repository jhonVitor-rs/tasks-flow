import { useTasksActions, type Task } from "../stores/tasks";
import { Button } from "./ui/button";
import { Eye, Trash2 } from "lucide-react";

export function TaskTableActions({ task }: { task: Task }) {
  const { removeTask } = useTasksActions();

  return (
    <div className="flex items-center justify-around w-full gap-4">
      {/* <Link to={`/tasks/${task.id}`}> */}
      <Button size={"icon"} variant={"link"} className="rounded-full">
        <Eye />
      </Button>
      {/* </Link> */}
      <Button
        size={"icon"}
        variant={"destructive"}
        onClick={() => removeTask(task.id)}
        className="rounded-full"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
