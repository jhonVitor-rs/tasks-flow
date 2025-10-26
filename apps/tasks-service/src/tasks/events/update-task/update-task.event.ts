import { TaskPriority, TaskStatus } from '@repo/core';

export class UpdateTaskEvent {
  constructor(
    public readonly taskId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly term: Date,
    public readonly assigneesIds: string[],
    public readonly authorId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly modifiedBy: string,
  ) {}
}
