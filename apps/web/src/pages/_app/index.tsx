import { createFileRoute, Link } from "@tanstack/react-router";
import { ListTodo } from "lucide-react";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/_app/")({ component: AppIndex });

function AppIndex() {
  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-primary/60">
      <div className="min-h-screen flex w-full items-center justify-center">
        <div>
          <div className="bg-primary p-4 rounded-md text-primary-foreground flex gap-2">
            <ListTodo className="size-8" />
            <span className="font-bold text-2xl">TasksFlow</span>
          </div>
          <div className="text-center">
            <Link to="/auth">
              <Button variant={"link"} className="cursor-pointer">
                Login / Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
