import { z } from "zod";
import type { Task } from "../stores/tasks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  CalendarClock,
  Clock,
  FileText,
  Flag,
  Target,
  User,
} from "lucide-react";
import { PriorityTaskSelect, StatusTaskSelect } from "./task-selects";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  term: z.date(),
});

export function TaskScreenForm({ task }: { task: Task }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: "",
      status: task.status,
      priority: task.priority,
      term: new Date(),
    },
  });

  const handleUpdate = () => {
    console.log("Update", form.getValues());
  };

  const statuUpdate = (vaule: "todo" | "in_progress" | "review" | "done") => {
    form.setValue("status", vaule);
    handleUpdate();
  };

  const priorityUpdate = (value: "low" | "medium" | "high" | "urgent") => {
    form.setValue("priority", value);
    handleUpdate();
  };

  const termUpdate = (value: Date | undefined) => {
    if (value) {
      form.setValue("term", value);
      handleUpdate();
    }
  };

  const createdAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const createdBy = "João Silva";

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Header Section - Title */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    onBlur={() => handleUpdate()}
                    placeholder="Enter task title..."
                    className="text-2xl md:text-3xl font-bold bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors placeholder:text-muted-foreground/40"
                  />
                </FormControl>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3" />
                    <span>Created {createdAt}</span>
                  </div>
                  <span className="text-muted-foreground/50">*</span>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3" />
                    <span>by {createdBy}</span>
                  </div>
                  <span className="text-muted-foreground/50">*</span>
                  <Badge variant={"outline"} className="text-xs px-2 py-0">
                    #{task.id?.slice(0, 8)}
                  </Badge>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Properties Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Properties
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Target className="size-4 text-muted-foreground" />
                    Status
                  </FormLabel>
                  <FormControl>
                    <StatusTaskSelect
                      changeValue={statuUpdate}
                      status={field.value}
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Flag className="size-4 text-muted-foreground" />
                    Priority
                  </FormLabel>
                  <FormControl>
                    <PriorityTaskSelect
                      changeValue={priorityUpdate}
                      priority={field.value}
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CalendarClock className="size-4 text-muted-foreground" />
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarClock className="mr-2 size-4" />
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
                      </PopoverTrigger>
                      <PopoverContent className="w-auto" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={termUpdate}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Description Section */}
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <FileText className="size-4 text-muted-foreground" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add a more detailed description of the task..."
                      rows={8}
                      onBlur={handleUpdate}
                      className="resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Add task details to fascilitate understanding. Supports up
                    to 500 characters.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Mobile Actions Buttons */}
        <div className="flex md:hidden gap-2 pt-4">
          <Button
            type="button"
            variant={"outline"}
            className="flex-1"
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={handleUpdate}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
