import { IRegisterUser } from '@repo/core';

export class RegisterUserCommand {
  constructor(public readonly data: IRegisterUser) {}
}
