import { INotification } from '@repo/core';

export class CreateNotificationCommand<T = any> {
  constructor(public readonly data: INotification<T>) {}
}
