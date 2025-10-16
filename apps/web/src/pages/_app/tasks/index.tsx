import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Calendar, LayoutGrid, LogOut, Plus, Table } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useTasksActions, useViewMode } from "../../../stores/tasks";

export const Route = createFileRoute("/_app/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  const view = useViewMode();
  const { setViewMode } = useTasksActions();

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
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={view} className="space-y-6">
          <TabsList className="bg-primary shadow-card md:gap-4 grid grid-cols-3 w-full max-w-96">
            <TabsTrigger
              value="table"
              onClick={() => setViewMode("table")}
              className="text-primary-foreground data-[state=active]:text-primary"
            >
              <Table className="size-4 mr-2" />
              Table
            </TabsTrigger>
            <TabsTrigger
              value="kanban"
              onClick={() => setViewMode("kanban")}
              className="text-primary-foreground data-[state=active]:text-primary"
            >
              <LayoutGrid className="size-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              onClick={() => setViewMode("calendar")}
              className="text-primary-foreground data-[state=active]:text-primary"
            >
              <Calendar className="size-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="animate-fade-in">
            <div>Table</div>
          </TabsContent>
          <TabsContent value="kanban" className="animate-fade-in">
            <div>Kanban</div>
          </TabsContent>
          <TabsContent value="calendar" className="animate-fade-in">
            <div>Calendar</div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
