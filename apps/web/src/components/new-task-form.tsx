import { z } from "zod";
import { useUserSession } from "../stores/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { CalendarClock, Flag, Target } from "lucide-react";
import { PriorityTaskSelect, StatusTaskSelect } from "./task-selects";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { useNewTaskMutation } from "../hooks/use-new-task-mutation";
import type { TaskPriority, TaskStatus } from "@repo/core";
import { useRef } from "react";

const formShcema = z.object({
  title: z.string().min(3).max(100),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  term: z.date(),
});

export function NewTaskForm() {
  const route = useRouter();
  const user = useUserSession();
  const ref= useRef<HTMLButtonElement>(null)
  const newTaskMutation = useNewTaskMutation();
  const form = useForm<z.infer<typeof formShcema>>({
    resolver: zodResolver(formShcema),
    defaultValues: {
      title: "",
      status: "todo",
      priority: "low",
      term: new Date(),
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!user) {
      toast.warning("Sorry, please log in to continue.");
      route.navigate({ to: "/auth" });
    }
    newTaskMutation.mutate(
      {
        title: data.title,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        term: data.term.toISOString(),
        createdBy: user!.id,
      },
      {
        onSuccess: () => {
          form.reset({
            title: "",
            status: "todo",
            priority: "low",
            term: new Date(),
          });
          ref.current?.click()
        },
        onError: (error) => {
          console.error(error);
          toast.warning("Error to create a task");
        },
      }
    );
  });

  const handleStatus = (vaule: "todo" | "in_progress" | "review" | "done") =>
    form.setValue("status", vaule);
  const handlePriority = (value: "low" | "medium" | "high" | "urgent") =>
    form.setValue("priority", value);
  const handleTerm = (value: Date | undefined) => {
    if (value) form.setValue("term", value);
  };

  const handleOpenChange = () =>
    form.reset({
      title: "",
      status: "todo",
      priority: "low",
      term: new Date(),
    });

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto" ref={ref}>
          <span className="hidden sm:inline">Add New Task</span>
          <span className="sm:hidden">New Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the fields below to create a new task
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título da tarefa"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Between 3 and 100 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Status
                    </FormLabel>
                    <FormControl>
                      <StatusTaskSelect
                        changeValue={handleStatus}
                        status={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      Priority
                    </FormLabel>
                    <FormControl>
                      <PriorityTaskSelect
                        changeValue={handlePriority}
                        priority={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    Due Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarClock className="mr-2 h-4 w-4" />
                          {field.value ? (
                            field.value.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleTerm}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
