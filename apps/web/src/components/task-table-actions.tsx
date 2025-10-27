import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Eye, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTask } from "../hooks/use-delete-task";
import type { IBasicTask } from "@repo/core";
import { toast } from "sonner";

export function TaskTableActions({ task }: { task: IBasicTask }) {
  const queryClient = useQueryClient()
  const mutation = useDeleteTask()

  const handleDelete = () => {
    mutation.mutate(
      task.id,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          toast.success("Task deleted successfully");
        },
        onError: (error) => {
          console.error("Error deleting task:", error);
          toast.error("Failed to delete task");
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-around w-full gap-4">
      <Link to="/tasks/$taskId" params={{ taskId: task.id }}>
        <Button size={"icon"} variant={"link"} className="rounded-full">
          <Eye />
        </Button>
      </Link>
      <Button
        size={"icon"}
        variant={"destructive"}
        onClick={handleDelete}
        disabled={mutation.isPending}
        className="rounded-full"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
