import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateCommentCommand } from './create-comment.command';
import { DataSource } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { Comment } from 'src/comments/entities/comment.entity';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand, { id: string }>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateCommentCommand): Promise<{ id: string }> {
    return await this.dataSource.transaction(async (manager) => {
      const { message, taskId, authorId } = command.data;

      const existsTask = await manager.existsBy(Task, { id: taskId });

      if (!existsTask) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Task not found',
        });
      }

      let comment = Comment.create(message, taskId, authorId);
      comment = this.eventPublisher.mergeObjectContext(comment);
      await manager.save(Comment, comment);
      comment.commit();

      return { id: comment.id };
    });
  }
}
