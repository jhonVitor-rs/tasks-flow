import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { EventsType, IBasicTask, INotification, TASK_EVENTS } from '@repo/core';
import { CreateTaskEvent } from './create-task.event';
import { UserLoaderService } from 'src/common/user-loader/user-loader.service';

@EventsHandler(CreateTaskEvent)
export class CreateTaskNotification implements IEventHandler<CreateTaskEvent> {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
    private readonly userLoader: UserLoaderService,
  ) {}

  async handle(event: CreateTaskEvent) {
    const author = await this.userLoader.loadAuthorName(event.authorId);

    const payload: INotification<IBasicTask> = {
      type: EventsType.CREATED,
      eventName: TASK_EVENTS.TASK_CREATED,
      payload: event.task,
      taskId: event.task.id,
      author: {
        id: event.authorId,
        name: author,
      },
      createdAt: new Date(Date.now()),
    };

    this.notificationService.emit(TASK_EVENTS.TASK_CREATED, payload);
  }
}
