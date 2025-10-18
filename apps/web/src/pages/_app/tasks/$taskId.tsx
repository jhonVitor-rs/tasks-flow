import { createFileRoute, Link } from "@tanstack/react-router";
import { TaskScreenForm } from "../../../components/task-screen-form";
import { AssignedUsers } from "../../../components/assigned-users";
import {
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { TaskComments } from "../../../components/task-comments";
import { Button } from "../../../components/ui/button";
import { Archive, ArrowLeft, Copy, MoreVertical, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/_app/tasks/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();

  const task = {
    id: taskId,
    title: "Implement new authentication system",
    description: "Create a secure authentication system with JWT tokens",
    comments: 3,
    priority: "high" as const,
    status: "in_progress" as const,
    term: new Date(Date.now() + 86400000 * 5),
  };

  const handleDeleteTask = () => {
    console.log("Delete task:", taskId);
  };

  const handleArchiveTask = () => {
    console.log("Archive task:", taskId);
  };

  const handleDuplicateTask = () => {
    console.log("Duplicate task:", taskId);
  };

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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarTrigger />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>View comments ({task.comments})</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

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
                      <DropdownMenuItem onClick={handleDuplicateTask}>
                        <Copy className="size-4 mr-2" />
                        Duplicate Task
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleArchiveTask}>
                        <Archive className="size-4 mr-2" />
                        Archive Task
                      </DropdownMenuItem>
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
                              Delte this task?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permantly
                              delete the task and all associated comments and
                              data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteTask}
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
                <TaskScreenForm task={task} />
              </div>

              <div className="animate-fade-in">
                <AssignedUsers />
              </div>

              <div className="animate-fade-in">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-muted-foreground/50" />
                      <span>Task created 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-muted-foreground" />
                      <span>Status changed to "IN Progress" 1 day ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-muted-foreground" />
                      <span>3 comments addes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TaskComments />
      </div>
    </SidebarProvider>
  );
}
