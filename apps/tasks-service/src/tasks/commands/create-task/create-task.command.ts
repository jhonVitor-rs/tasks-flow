import { ICreateTask } from '@repo/core';

export class CreateTaskCommand {
  constructor(public readonly data: ICreateTask) {}
}
