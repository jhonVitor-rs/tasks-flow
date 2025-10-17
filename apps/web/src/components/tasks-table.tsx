import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTasksPagination, useTasks, useTasksActions } from "../stores/tasks";
import { tasksColumns } from "./tasks-columns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DataTable } from "./data-table";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
} from "lucide-react";

export function TasksTable() {
  const tasks = useTasks();
  const { page, pageSize, totalPages } = useTasksPagination();
  const { setPage, setPageSize } = useTasksActions();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: tasks,
    columns: tasksColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  const handlePageSize = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    table.setPageSize(newPageSize);
  };

  const handleFirstPage = () => {
    table.setPageIndex(0);
    setPage(1);
  };

  const handlePreviousPage = () => {
    table.previousPage();
    setPage(page - 1);
  };

  const handleNextPage = () => {
    table.nextPage();
    setPage(page + 1);
  };

  const handleLastPage = () => {
    table.setPageIndex(totalPages - 1);
    setPage(totalPages);
  };

  const visibleColumnsCount = table
    .getAllColumns()
    .filter((col) => col.getIsVisible()).length;
  const totalColumnsCount = table
    .getAllColumns()
    .filter((col) => col.getCanHide()).length;

  return (
    <Card className="overflow-visible">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Tasks</CardTitle>

          {/* Column Visibility - Desktop e Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <Columns3 className="h-4 w-4" />
                <span className="hidden sm:inline">Columns</span>
                <span className="text-xs text-muted-foreground">
                  ({visibleColumnsCount}/{totalColumnsCount})
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Table Content */}
      <CardContent className="px-0 py-0">
        <DataTable columns={tasksColumns} table={table} loading={false} />
      </CardContent>

      {/* Footer - Pagination */}
      <CardFooter className="flex-col gap-4 py-4 overflow-visible">
        {/* Mobile Pagination - Stacked */}
        <div className="flex flex-col sm:hidden w-full gap-3">
          {/* Page Size Selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSize}>
              <SelectTrigger className="h-9 w-[70px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="top"
                sideOffset={5}
                className="z-50"
              >
                {[5, 10, 20, 25, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Info */}
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleFirstPage}
              disabled={page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handlePreviousPage}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleNextPage}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleLastPage}
              disabled={page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Pagination - Horizontal */}
        <div className="hidden sm:flex w-full items-center justify-between">
          {/* Left: Page Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSize}>
              <SelectTrigger className="h-8 w-[70px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="top"
                sideOffset={5}
                className="z-50"
              >
                {[5, 10, 20, 25, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Center: Page Info */}
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={handleFirstPage}
              disabled={page <= 1}
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePreviousPage}
              disabled={page <= 1}
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextPage}
              disabled={page >= totalPages}
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={handleLastPage}
              disabled={page >= totalPages}
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Info adicional - opcional */}
        <div className="hidden lg:flex w-full justify-center">
          <span className="text-xs text-muted-foreground">
            Showing {tasks.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(page * pageSize, tasks.length)} of {tasks.length} tasks
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
