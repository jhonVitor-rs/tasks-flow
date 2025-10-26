import { IUpdatedTask } from '@repo/core';

export class UpdateTaskCommand {
  constructor(public readonly data: IUpdatedTask) {}
}
