import { DataSource } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TaskPriority, TaskStatus } from '@repo/core';
import { UpdateTaskCommand } from './update-task.command';
import { Task } from 'src/tasks/entities/task.entity';
import { UserLoaderService } from 'src/common/user-loader/user-loader.service';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler
  implements ICommandHandler<UpdateTaskCommand, { id: string }>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userLoader: UserLoaderService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<{ id: string }> {
    return await this.dataSource.transaction(async (manager) => {
      const { id, assigneeIds, modifiedBy, ...updateData } = command.data;

      let task = await manager.findOne(Task, { where: { id: id } });
      if (!task) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Task not found',
        });
      }

      let verifiedAssigneeIds = task.verifiedAssigneeIds;
      if (assigneeIds !== undefined) {
        verifiedAssigneeIds = await this.verifyAndMergeAssignees(
          task.verifiedAssigneeIds,
          assigneeIds,
        );
      }

      manager.merge(Task, task, {
        ...updateData,
        ...(assigneeIds !== undefined && { assigneeIds }),
        verifiedAssigneeIds,
      });

      task.updateTaskEvent(
        task.id,
        task.title,
        task.description || '',
        task.status as TaskStatus,
        task.priority as TaskPriority,
        task.term,
        task.verifiedAssigneeIds,
        task.createdBy,
        task.createdAt,
        task.updatedAt,
        modifiedBy,
      );
      task = this.eventPublisher.mergeObjectContext(task);

      await manager.save(Task, task);
      task.commit();

      return { id: task.id };
    });
  }

  private async verifyAndMergeAssignees(
    currentVerified: string[],
    newAssigneedIds: string[],
  ): Promise<string[]> {
    const currentVerifiedSet = new Set(currentVerified);
    const newVerifiedIds: string[] = [];

    const alreadyVerified = newAssigneedIds.filter((id) =>
      currentVerifiedSet.has(id),
    );
    const needVerification = newAssigneedIds.filter(
      (id) => !currentVerifiedSet.has(id),
    );

    if (needVerification.length > 0) {
      const verified =
        await this.userLoader.verificationUsersExistence(needVerification);
      newAssigneedIds.push(...verified);
    }

    return [...alreadyVerified, ...newVerifiedIds];
  }
}
