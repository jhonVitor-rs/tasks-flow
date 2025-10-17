import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Target } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  status: z.string(),
  priority: z.string(),
  term: z.date(),
  assignedUsers: z.array(z.string()),
  comments: z.array(
    z.object({
      author: z.string(),
      text: z.string().min(3).max(200),
    })
  ),
});

export const Route = createFileRoute("/_app/tasks/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      priority: "",
      term: new Date(),
      assignedUsers: [],
      comments: [],
    },
  });

  return (
    <div className="min-h-screen bg-muted overflow-auto p-8">
      <div className="container space-y-8 mx-auto">
        <Form {...form}>
          <form className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Task Title..."
                        className="text-xl font-bold bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <Target />
                          <SelectValue placeholder="Select task status" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-50">
                          <SelectItem value="todo">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-slate-500" />
                              Todo
                            </div>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              In Progress
                            </div>
                          </SelectItem>
                          <SelectItem value="review">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                              Review
                            </div>
                          </SelectItem>
                          <SelectItem value="done">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              Done
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Card></Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
