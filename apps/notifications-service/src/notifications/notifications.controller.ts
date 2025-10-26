import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  IBasicTask,
  IComment,
  INotification,
  ITask,
  TASK_EVENTS,
} from '@repo/core';
import { CreateNotificationCommand } from './commands/create-notification/create-notification.command';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly commandBus: CommandBus) {}

  private async proccessNotificationDto<T>(
    data: INotification<T>,
    context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const result = await this.commandBus.execute(
        new CreateNotificationCommand<T>(data),
      );

      if (result) {
        channel.ack(originalMsg);
        console.log(`Notification processed successfully: ${result.id}`);
      } else {
        console.error('Failed to preccess notification, requeueing...');
        channel.nack(originalMsg, false, true);
      }
    } catch (error) {
      try {
        channel.nack(originalMsg, false, true);
      } catch (ackError) {
        console.error('Error sending nack:', ackError);
      }
    }
  }

  @EventPattern(TASK_EVENTS.TASK_CREATED)
  async handleTaskCreated(
    @Payload() data: INotification<IBasicTask>,
    @Ctx() context: RmqContext,
  ) {
    await this.proccessNotificationDto<IBasicTask>(data, context);
  }

  @EventPattern(TASK_EVENTS.TASK_UPDATED)
  async handleTaskUpdated(
    @Payload() data: INotification<ITask>,
    @Ctx() context: RmqContext,
  ) {
    await this.proccessNotificationDto<ITask>(data, context);
  }

  @EventPattern(TASK_EVENTS.COMMENTED)
  async handleTaskCommentes(
    @Payload() data: INotification<IComment>,
    @Ctx() context: RmqContext,
  ) {
    await this.proccessNotificationDto<IComment>(data, context);
  }
}
