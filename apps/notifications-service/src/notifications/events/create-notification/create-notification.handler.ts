import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateNotificationEvent } from './create-notification.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_EVENTS } from '@repo/core';

@EventsHandler(CreateNotificationEvent)
export class CreateNotificationHandler
  implements IEventHandler<CreateNotificationEvent>
{
  constructor(
    @Inject('GATEWAY_SERVICE')
    private readonly gatewayServce: ClientProxy,
  ) {}

  async handle(event: CreateNotificationEvent) {
    const { id, notification } = event;

    try {
      this.gatewayServce.emit(NOTIFICATIONS_EVENTS.NEW_NOTIFICATION, {
        type: notification.type,
        eventName: notification.eventName,
        payload: notification.payload,
        message: notification.message,
        taskId: notification.taskId,
        author: notification.author,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
      });

      console.log(`Notification ${id} send to gateway`);
    } catch (error) {
      console.error('Failed to send notifiation to gateway: ', error);
    }
  }
}
