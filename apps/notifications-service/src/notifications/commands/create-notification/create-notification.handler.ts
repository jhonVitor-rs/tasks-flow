import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from './create-notification.command';
import { Notification } from '../../entities/notification.entity';
import { CreateNotificationEvent } from '../../events/create-notification/create-notification.event';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler
  implements ICommandHandler<CreateNotificationCommand, Notification | null>
{
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateNotificationCommand<any>,
  ): Promise<Notification | null> {
    try {
      const newNotification = this.notificationRepository.create({
        type: command.data.type,
        eventName: command.data.eventName,
        payload: command.data.payload,
        taskId: command.data.taskId,
        actorId: command.data.author.id,
        message: command.data.message,
        metadata: command.data.metadata,
        createdAt: command.data.createdAt,
      });

      const savedNotification =
        await this.notificationRepository.save(newNotification);

      this.eventBus.publish(
        new CreateNotificationEvent(savedNotification.id, command.data),
      );

      return savedNotification;
    } catch (error) {
      console.error('Filed to save event: ', error);
      return null;
    }
  }
}
