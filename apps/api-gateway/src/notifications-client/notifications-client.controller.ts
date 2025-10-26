import { Controller } from '@nestjs/common';
import { NotificationsClientSocket } from './notifications-client.socket';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { type INotification, NOTIFICATIONS_EVENTS } from '@repo/core';

@Controller('notifications-client')
export class NotificationsClientController {
  constructor(private readonly nfSocket: NotificationsClientSocket) {}

  private ackMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    channel.ack(msg);
  }

  @EventPattern(NOTIFICATIONS_EVENTS.NEW_NOTIFICATION)
  async handleNotification(
    @Payload() data: INotification,
    @Ctx() context: RmqContext,
  ) {
    this.nfSocket.broadcast(data.eventName, data);
    this.ackMessage(context);
  }
}
