import { ICreateComment } from '@repo/core';

export class CreateCommentCommand {
  constructor(public readonly data: ICreateComment) {}
}
