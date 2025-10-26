import { ILoginUser } from '@repo/core';

export class LoginUserCommand {
  constructor(public readonly data: ILoginUser) {}
}
