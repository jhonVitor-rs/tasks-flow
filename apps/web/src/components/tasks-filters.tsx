import { CalendarIcon, Filter, X } from "lucide-react";
import { useTaskQuery, useTasksActions } from "../stores/tasks";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import type { ChangeEvent } from "react";
import { isTaskStatus } from "../constants/task-status";
import { isTaskPriority } from "../constants/task-priority";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

function FilterForm() {
  const query = useTaskQuery();
  const { setQuery } = useTasksActions();

  const selectedRange = query.termInterval
    ? {
        from: new Date(query.termInterval.gte ?? undefined),
        to: new Date(query.termInterval.lte ?? undefined),
      }
    : undefined;

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery({ ...query, title: e.target.value });
  };

  const handleStatus = (value: string) => {
    if (isTaskStatus(value)) {
      setQuery({ ...query, status: value });
    } else if (value === "all") {
      setQuery({ ...query, status: undefined });
    }
  };

  const handlePriority = (value: string) => {
    if (isTaskPriority(value)) {
      setQuery({ ...query, priority: value });
    } else if (value === "all") {
      setQuery({ ...query, priority: undefined });
    }
  };

  const handleDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range.to) {
      setQuery({
        ...query,
        termInterval: {
          gte: range.from.toDateString(),
          lte: range.to.toDateString(),
        },
      });
    } else if (range?.from && !range.to) {
      setQuery({
        ...query,
        termInterval: {
          gte: range.from.toDateString(),
          lte: range.from.toDateString(),
        },
      });
    } else {
      setQuery({ ...query, termInterval: undefined });
    }
  };

  const clearAllFilters = () => {
    setQuery({
      ...query,
      title: undefined,
      status: undefined,
      priority: undefined,
      termInterval: undefined,
    });
  };

  const hasActiveFilters =
    query.title || query.priority || query.status || query.termInterval;

  const formatDateRange = () => {
    if (!query.termInterval) return "Select date range";

    const fromDate = query.termInterval.gte
      ? new Date(query.termInterval.gte)
      : null;
    const toDate = query.termInterval.lte
      ? new Date(query.termInterval.lte)
      : null;

    const from = fromDate?.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    const to = toDate?.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });

    return from && to ? `${from} - ${to}` : from || to || "Select date range";
  };

  return (
    <div className="space-y-6">
      {/* Header com contador de filtros ativos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Filters</h3>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-xs"
            >
              {
                [
                  query.title,
                  query.priority,
                  query.status,
                  query.termInterval,
                ].filter(Boolean).length
              }
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search-input" className="text-sm font-medium">
          Search
        </Label>
        <Input
          id="search-input"
          value={query.title || ""}
          onChange={handleTitle}
          placeholder="Search task by title..."
          className="bg-input/70 border-border focus-visible:ring-primary"
        />
      </div>

      {/* Filtros em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-select" className="text-sm font-medium">
            Status
          </Label>
          <Select value={query.status || "all"} onValueChange={handleStatus}>
            <SelectTrigger
              id="status-select"
              className="w-full bg-background border-border"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-50">
              <SelectItem value="all">All Statuses</SelectItem>
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
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <Label htmlFor="priority-select" className="text-sm font-medium">
            Priority
          </Label>
          <Select
            value={query.priority || "all"}
            onValueChange={handlePriority}
          >
            <SelectTrigger
              id="priority-select"
              className="w-full bg-background border-border"
            >
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-50">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  High
                </div>
              </SelectItem>
              <SelectItem value="urgent">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Urgent
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date Range</Label>

          {/* Mobile: Calendar direto */}
          <div className="md:hidden">
            <div className="border border-border rounded-lg p-3 bg-background">
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleDateChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Desktop: Popover */}
          <Popover>
            <PopoverTrigger asChild className="hidden md:flex">
              <Button
                variant="outline"
                data-empty={!query.termInterval}
                className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground border-border"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="truncate">{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {query.title && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setQuery({ ...query, title: undefined })}
            >
              Search: {query.title}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {query.status && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setQuery({ ...query, status: undefined })}
            >
              Status: {query.status}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {query.priority && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setQuery({ ...query, priority: undefined })}
            >
              Priority: {query.priority}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {query.termInterval && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setQuery({ ...query, termInterval: undefined })}
            >
              Date: {formatDateRange()}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export function TasksFilters() {
  return (
    <div>
      {/* Mobile: Drawer */}
      <div className="md:hidden">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-6 h-full">
            <DrawerTitle className="text-lg font-semibold mb-4">
              Filter Tasks
            </DrawerTitle>
            <div className="overflow-y-auto">
              <FilterForm />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Inline */}
      <Card className="hidden md:block">
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="Flter">
              <AccordionTrigger>
                <span className="text-xl font-semibold flex items-center gap-4">
                  <Filter className="size-4" />
                  Filters
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <FilterForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
