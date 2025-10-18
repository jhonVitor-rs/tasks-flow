import { CalendarIcon, Filter, X } from "lucide-react";
import { useTasksActions, useTasksFilters } from "../stores/tasks";
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
  const { input, priority, status, termInterval } = useTasksFilters();
  const { setInputFilter, setPriorityFilter, setStatusFilter, setTermFilter } =
    useTasksActions();

  const selectedRange = termInterval
    ? { from: termInterval.gte ?? undefined, to: termInterval.lte ?? undefined }
    : undefined;

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputFilter(e.target.value);
  };

  const handleStatus = (value: string) => {
    if (isTaskStatus(value)) {
      setStatusFilter(value);
    } else if (value === "all") {
      setStatusFilter(null);
    }
  };

  const handlePriority = (value: string) => {
    if (isTaskPriority(value)) {
      setPriorityFilter(value);
    } else if (value === "all") {
      setPriorityFilter(null);
    }
  };

  const handleDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range.to) {
      setTermFilter({
        gte: range.from,
        lte: range.to,
      });
    } else if (range?.from && !range.to) {
      setTermFilter({
        gte: range.from,
        lte: range.to || null,
      });
    } else {
      setTermFilter(null);
    }
  };

  const clearAllFilters = () => {
    setInputFilter(null);
    setStatusFilter(null);
    setPriorityFilter(null);
    setTermFilter(null);
  };

  const hasActiveFilters = input || priority || status || termInterval;

  const formatDateRange = () => {
    if (!termInterval) return "Select date range";

    const fromDate = termInterval.gte ? new Date(termInterval.gte) : null;
    const toDate = termInterval.lte ? new Date(termInterval.lte) : null;

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
              {[input, priority, status, termInterval].filter(Boolean).length}
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
          value={input || ""}
          onChange={handleInput}
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
          <Select value={status || "all"} onValueChange={handleStatus}>
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
          <Select value={priority || "all"} onValueChange={handlePriority}>
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
                data-empty={!termInterval}
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
          {input && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setInputFilter(null)}
            >
              Search: {input}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {status && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setStatusFilter(null)}
            >
              Status: {status}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {priority && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setPriorityFilter(null)}
            >
              Priority: {priority}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {termInterval && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setTermFilter(null)}
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
