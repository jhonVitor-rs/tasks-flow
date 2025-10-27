import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import { ScrollArea } from "./ui/scroll-area";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Clock, MessageSquare, Send } from "lucide-react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "../lib/utils";
import { useCommentsQuery } from "../hooks/use-comments-query";
import type { IComment } from "@repo/core";
import { useUserSession } from "../stores/session";
import { useCommentMutation } from "../hooks/use-comment-mutation";
import { toast } from "sonner";
import { useSocketConnect } from "../hooks/use-socket-connection";
import { useGlobalEvents } from "../hooks/use-global-events";

const formSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message isto long"),
});
export function TaskComments({taskId}: {taskId: string}) {
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<IComment[]>([]);
  const result = useCommentsQuery(taskId, {page , size: 10, taskId: taskId})
  const user = useUserSession()
  const mutation = useCommentMutation(taskId)

  const socket = useSocketConnect();
  useGlobalEvents(socket);

  useEffect(() => {
    if (result.data) {
      setComments(result.data.data)
    }
  }, [result])
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(
      {taskId, message: values.message, authorId: user!.id},
      {
        onError: () => {
          toast.warning('Failed to create comment')
        }
      }
    )
    form.reset();
  };

  const getInitial = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    else if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    else if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    else if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const messageLength = form.watch("message").length || 0;
  const isValid = messageLength >= 10 && messageLength <= 500;

  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Comments</CardTitle>
          </div>
          <Badge variant={"secondary"} className="text-sm">
            {comments.length}
          </Badge>
        </div>
        <CardDescription className="mt-2 text-xs">
          Discuss and collaborate on this task
        </CardDescription>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="px-4 py-4 space-y-4">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-3">
                  <MessageSquare className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No comments yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  Be the first share your thoughts on this task
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border-l-4 border-l-primary/20 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="size-9 ring-2 ring-background">
                          <AvatarFallback>
                            <span className="text-xs font-semibold text-white">
                              {getInitial(comment.author.name)}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">
                            {comment.author.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Clock className="size-3" />
                            <span>{getTimeAgo(new Date(comment.createdAt))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-foreground/90">
                    {comment.message}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write a comment..."
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="flex items-center justify-between pt-1">
                    <FormMessage className="text-xs" />
                    <span
                      className={cn(
                        "text-xs",
                        !isValid
                          ? "text-muted-foreground"
                          : messageLength > 450
                            ? "text-orange-500"
                            : "text-green-500"
                      )}
                    >
                      {messageLength}/500
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid} className="w-full gap-4">
              <Send className="size-4" />
            </Button>
          </form>
        </Form>
      </SidebarFooter>
    </Sidebar>
  );
}
