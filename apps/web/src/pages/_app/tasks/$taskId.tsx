import { createFileRoute, Link } from "@tanstack/react-router";
import { TaskScreenForm } from "../../../components/task-screen-form";
import { AssignedUsers } from "../../../components/assigned-users";
import {
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { TaskComments } from "../../../components/task-comments";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useQueryTask } from "../../../hooks/use-query-task";
import { useEffect, useState } from "react";
import type { ITask } from "@repo/core";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTask } from "../../../hooks/use-delete-task";
import { toast } from "sonner";
import { useSocketConnect } from "../../../hooks/use-socket-connection";
import { useGlobalEvents } from "../../../hooks/use-global-events";

export const Route = createFileRoute("/_app/tasks/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();
  const [task, setTask] = useState<ITask>()
  const query = useQueryTask(taskId)
  const queryClient = useQueryClient()
  const mutationDelete = useDeleteTask()
  
  const socket = useSocketConnect();
  useGlobalEvents(socket);

  useEffect(() => {
    if (query) {
      setTask(query)
    }
  }, [query])

  const handleDelete = () => {
    mutationDelete.mutate(
      task!.id,
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
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex-1 overflow-auto">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/** Header */}
            <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6 bg-background/80 backdrop-blur-lg border-b">
              <div className="flex items-center justify-between gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/tasks">
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="rounded-full hover:bg-muted"
                        >
                          <ArrowLeft className="size-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Back to tasks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Badge
                  variant={"outline"}
                  className="hidden sm:flex gap-2 px-3"
                >
                  Task #{taskId.slice(0, 8)}
                </Badge>

                <div className="flex items-center gap-2">
                  <SidebarTrigger />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="rounded-full"
                      >
                        <MoreVertical className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete Task
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this task?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permantely
                              delete the task and all associated comments and
                              data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete Task
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6 pb-8">
              <div className="animate-fade-in">
                {task && 
                <TaskScreenForm task={task} />
                }
              </div>

              <div className="animate-fade-in">
                {task && <AssignedUsers task={task} />}
              </div>
            </div>
          </div>
        </div>
        {task && <TaskComments taskId={task.id}/>}
      </div>
    </SidebarProvider>
  );
  }
