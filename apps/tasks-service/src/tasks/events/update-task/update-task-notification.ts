import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateTaskEvent } from './update-task.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsType, INotification, ITask, TASK_EVENTS } from '@repo/core';
import { UserLoaderService } from 'src/common/user-loader/user-loader.service';

@EventsHandler(UpdateTaskEvent)
export class UpdateTaskNotification implements IEventHandler<UpdateTaskEvent> {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
    private readonly userLoader: UserLoaderService,
  ) {}

  async handle(event: UpdateTaskEvent) {
    const [author, assignees, modifyAuthor] = await Promise.all([
      this.userLoader.loadAuthorName(event.authorId),
      this.userLoader.loadUsers(event.assigneesIds),
      this.userLoader.loadAuthorName(event.modifiedBy),
    ]);

    const payload: INotification<ITask> = {
      type: EventsType.UPDATED,
      eventName: TASK_EVENTS.TASK_UPDATED,
      payload: {
        id: event.taskId,
        title: event.title,
        description: event.description,
        status: event.status,
        priority: event.priority,
        createdBy: {
          id: event.authorId,
          name: author,
        },
        term: event.term,
        assignees: assignees,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
      taskId: event.taskId,
      author: {
        id: event.modifiedBy,
        name: modifyAuthor,
      },
      createdAt: new Date(Date.now()),
    };

    this.notificationService.emit(TASK_EVENTS.TASK_UPDATED, payload);
  }
}
