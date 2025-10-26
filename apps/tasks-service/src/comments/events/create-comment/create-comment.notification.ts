import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateCommentEvent } from './create-comment.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserLoaderService } from 'src/common/user-loader/user-loader.service';
import { EventsType, IComment, INotification, TASK_EVENTS } from '@repo/core';

@EventsHandler(CreateCommentEvent)
export class CreateCommentNotification
  implements IEventHandler<CreateCommentEvent>
{
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
    private readonly userLoader: UserLoaderService,
  ) {}

  async handle(event: CreateCommentEvent) {
    const author = await this.userLoader.loadAuthorName(event.authorId);

    const payload: INotification<IComment> = {
      type: EventsType.COMMENTED,
      eventName: TASK_EVENTS.COMMENTED,
      payload: {
        id: event.commentId,
        taskId: event.taskId,
        message: event.message,
        author: {
          id: event.authorId,
          name: author,
        },
        createdAt: event.createdAt,
      },
      taskId: event.taskId,
      author: {
        id: event.authorId,
        name: author,
      },
      createdAt: new Date(Date.now()),
    };

    this.notificationService.emit(TASK_EVENTS.COMMENTED, payload);
  }
}
