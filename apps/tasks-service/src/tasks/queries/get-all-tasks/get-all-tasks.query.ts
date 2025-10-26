import { ITasksQuery } from '@repo/core';

export class GetAllTasksQuery {
  constructor(public readonly data: ITasksQuery) {}
}
