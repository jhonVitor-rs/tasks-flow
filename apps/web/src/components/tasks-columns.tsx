import type { ColumnDef } from "@tanstack/react-table";
import { type Task } from "../stores/tasks";
import { DataTableColumnHeader } from "./data-table-column-header";
import { StatusTaskSelect, PriorityTaskSelect } from "./task-selects";
import { Badge } from "./ui/badge";
import { TaskTableActions } from "./task-table-actions";

export const tasksColumns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   accessorKey: "id",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px] mr-4 shadow shadow-primary"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px] shadow shadow-primary border border-primary bg-background"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" className="ml-5" />
    ),
    cell: ({ row }) => <div className="ml-5">{row.getValue("title")}</div>,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div>
        <StatusTaskSelect task={row.original} />
      </div>
    ),
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => (
      <div>
        <PriorityTaskSelect task={row.original} />
      </div>
    ),
  },
  {
    id: "term",
    accessorKey: "term",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term" />
    ),
    cell: ({ row }) => {
      const today = new Date();
      const term = new Date(row.original.term);

      const diff = term.getTime() - today.getTime();
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

      const variant =
        daysLeft < 0
          ? "destructive"
          : daysLeft <= 2
            ? "default"
            : daysLeft <= 7
              ? "secondary"
              : "outline";

      const text =
        daysLeft < 0
          ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""}`
          : daysLeft === 0
            ? "Due today"
            : `In ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;

      return (
        <div>
          <Badge variant={variant}>{text}</Badge>
        </div>
      );
    },
  },
  {
    id: "comments",
    accessorKey: "comments",
    header: () => <div>Comments</div>,
    cell: ({ row }) => (
      <div className="w-full text-center">
        <span className="border border-primary flex size-8 items-center justify-center rounded-full m-auto">
          {row.getValue("comments")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="mr-5">Actions</div>,
    cell: ({ row }) => <TaskTableActions task={row.original} />,
  },
];
