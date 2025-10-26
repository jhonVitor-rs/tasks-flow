import { INotification } from '@repo/core';

export class CreateNotificationEvent<T = any> {
  constructor(
    public readonly id: string,
    public readonly notification: INotification<T>,
  ) {}
}
