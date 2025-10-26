import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ITask, TaskPriority, TaskStatus } from '@repo/core';
import { GetTaskQuery } from './get-task.query';
import { Task } from 'src/tasks/entities/task.entity';
import { UserLoaderService } from 'src/common/user-loader/user-loader.service';

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery, ITask> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userLoader: UserLoaderService,
  ) {}

  async execute(query: GetTaskQuery): Promise<ITask> {
    const task = await this.dataSource.getRepository(Task).findOne({
      where: { id: query.id },
    });

    if (!task) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Task not found',
      });
    }

    const [author, assignees] = await Promise.all([
      this.userLoader.loadAuthorName(task.createdBy),
      this.userLoader.loadUsers(task.verifiedAssigneeIds),
    ]);

    return {
      id: task.id,
      title: task.title,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      term: task.term,
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      createdBy: {
        id: task.createdBy,
        name: author,
      },
      assignees,
    };
  }
}
