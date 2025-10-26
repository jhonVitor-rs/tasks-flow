import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import {
  TaskStatusSelectAdapter,
  TaskPrioritySelectAdapter,
} from "./task-selects";
import { Badge } from "./ui/badge";
import { TaskTableActions } from "./task-table-actions";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Timer,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import type { IBasicTask } from "@repo/core";

export const tasksColumns: ColumnDef<IBasicTask>[] = [
  {
    id: "title",
    accessorKey: "title",
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" className="pl-4" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3 pl-4 py-2">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-medium text-foreground truncate">
            {row.getValue("title")}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div>
        <TaskStatusSelectAdapter task={row.original} />
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "priority",
    accessorKey: "priority",
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => (
      <div>
        <TaskPrioritySelectAdapter task={row.original} />
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "term",
    accessorKey: "term",
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const term = new Date(row.original.term);
      term.setHours(0, 0, 0, 0);

      const diff = term.getTime() - today.getTime();
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

      let variant: "destructive" | "default" | "secondary" | "outline" =
        "outline";
      let icon = <Calendar className="size-3.5" />;
      let text = "";
      let bgClass = "";

      if (daysLeft < 0) {
        variant = "destructive";
        icon = <AlertCircle className="size-3.5" />;
        text = `${Math.abs(daysLeft)}d overdue`;
        bgClass = "bg-destructive";
      } else if (daysLeft === 0) {
        variant = "default";
        icon = <Clock className="size-3.5" />;
        text = "Due today";
        bgClass =
          "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      } else if (daysLeft === 1) {
        variant = "secondary";
        icon = <Timer className="h-3.5 w-3.5" />;
        text = "Tomorrow";
        bgClass =
          "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      } else if (daysLeft <= 7) {
        variant = "secondary";
        icon = <Calendar className="h-3.5 w-3.5" />;
        text = `${daysLeft} days`;
      } else {
        variant = "outline";
        icon = <CheckCircle2 className="h-3.5 w-3.5" />;
        text = `${daysLeft} days`;
      }

      const formattedDate = term.toLocaleDateString("en-UD", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Badge
                  variant={variant}
                  className={`gap-1.5 font-normal ${bgClass}`}
                >
                  {icon}
                  <span className="hidden sm:inline">{text}</span>
                  <span className="sm:hidden">{daysLeft}d</span>
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{formattedDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.term).getTime();
      const dateB = new Date(rowB.original.term).getTime();
      return dateA - dateB;
    },
  },
  {
    id: "comments",
    accessorKey: "comments",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Comments"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const count = row.getValue("comments") as number;
      const hasComments = count > 0;

      return (
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-active={hasComments}
                  className="flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 transition-colors data-[active=true]:bg-primary/10 data-[active=false]:bg-muted"
                >
                  <MessageSquare
                    className={`size-3.5 ${hasComments ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-xs font-medium ${hasComments ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {count === 0 ? "No comments yet" : `${count} comment(s)`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right pr-4">
        <span className="text-sm font-medium">Actions</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end pr-4">
        <TaskTableActions task={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
