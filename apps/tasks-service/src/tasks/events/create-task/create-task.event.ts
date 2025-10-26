import { IBasicTask } from '@repo/core';

export class CreateTaskEvent {
  constructor(
    public readonly task: IBasicTask,
    public readonly authorId: string,
  ) {}
}
