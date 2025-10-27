import { Plus, X, Users, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { ITask, IUser } from "@repo/core";
import { useQueryUsers } from "../hooks/use-query-users";
import { useUpdateTask } from "../hooks/use-update-task";
import { useUserSession } from "../stores/session";

export function AssignedUsers(
  {task}: {task: ITask}
) {
  const [users, setUsers] = useState<IUser[]>(useQueryUsers());
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateTask()
  const userSession = useUserSession()

  const addUser = (user: IUser) => {
    if (!users.find((u) => u.id === user.id)) {
    const assigneeIds = [
      ...task.assignees.map(a => a.id), 
      user.id,
    ]

    const uniqueAssigneeIds = Array.from(new Set(assigneeIds))

    updateMutation.mutate({
      id: task.id,
      modifiedBy: userSession!.id,
      assigneeIds: uniqueAssigneeIds,
    })
  }
    setOpen(false);
  };

  const removeUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Assigned Users
            </CardTitle>
            {users.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {users.length}
              </Badge>
            )}
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[280px]" align="end">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandList>
                  <CommandEmpty>No users found</CommandEmpty>
                  <CommandGroup heading="Available Users">
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={() => addUser(user)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <span className="text-xs font-semibold text-white">
                              {getInitials(user.name)}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                        {users.find((u) => u.id === user.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent>
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No users assigned yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Add User" to assign someone to this task
            </p>
          </div>
        ) : (
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <Avatar className="h-10 w-10 ring-2 ring-background hover:ring-primary/50 transition-all cursor-pointer">
                        <AvatarFallback>
                          <span className="text-sm font-semibold text-white">
                            {getInitials(user.name)}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        onClick={() => removeUser(user.id)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        variant="destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="flex flex-col gap-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to remove
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}

        {/* Summary */}
        {users.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              {users.length} {users.length === 1 ? "user" : "users"} assigned
            </p>
            {users.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUsers([])}
                className="h-7 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
