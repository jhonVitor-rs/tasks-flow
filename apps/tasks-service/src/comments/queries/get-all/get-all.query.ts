import { ICommentsQuery } from '@repo/core';

export class GetAllCommentsQuery {
  constructor(public readonly query: ICommentsQuery) {}
}
