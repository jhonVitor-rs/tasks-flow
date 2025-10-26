import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { TasksFilters } from "../../../components/tasks-filters";
import { TasksTable } from "../../../components/tasks-table";
import { useSimpleMiddleware } from "../../../hooks/use-simple-middleware";
import { useQueryTasks } from "../../../hooks/use-query-tasks";

export const Route = createFileRoute("/_app/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSimpleMiddleware();
  useQueryTasks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-primary/60">
      <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">My Tasks</h1>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="size-4 mr-1" />
                New Task
              </Button>
              <Button variant={"outline"}>
                <LogOut />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        <TasksFilters />
        <TasksTable />
      </main>
    </div>
  );
}
