import {
  Between,
  DataSource,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { IBasicTask, IPagination, TaskPriority, TaskStatus } from '@repo/core';
import { GetAllTasksQuery } from './get-all-tasks.query';
import { Task } from 'src/tasks/entities/task.entity';

@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler
  implements IQueryHandler<GetAllTasksQuery, IPagination<IBasicTask>>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute(query: GetAllTasksQuery): Promise<IPagination<IBasicTask>> {
    const {
      page,
      size,
      title,
      status,
      priority,
      termInterval,
      orderBy,
      order,
    } = query.data;

    const whereConditions: FindOptionsWhere<Task> = {};

    if (title) {
      whereConditions.title = ILike(`%${title}%`);
    }

    if (status) {
      whereConditions.status = status;
    }

    if (priority) {
      whereConditions.priority = priority;
    }

    if (termInterval) {
      if (termInterval.gte && termInterval.lte) {
        whereConditions.term = Between(
          new Date(termInterval.gte),
          new Date(termInterval.lte),
        );
      } else if (termInterval.gte) {
        whereConditions.term = MoreThanOrEqual(new Date(termInterval.gte));
      } else if (termInterval.lte) {
        whereConditions.term = LessThanOrEqual(new Date(termInterval.lte));
      }
    }

    const skip = (page - 1) * size;

    const queryBuilder = this.dataSource
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoin('task.comments', 'comment')
      .select([
        'task.id',
        'task.title',
        'task.status',
        'task.priority',
        'task.term',
        'task.createdAt',
        'COUNT(comment.id) as commentsCount',
      ])
      .groupBy('task.id');

    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    const [data, total] = await Promise.all([
      queryBuilder
        .orderBy(orderBy || 'task.createdAt', order || 'ASC')
        .skip(skip)
        .take(size)
        .getRawMany(),
      queryBuilder.getCount(),
    ]);

    const basicTasks: IBasicTask[] = data.map((task: any) => ({
      id: task.task_id,
      title: task.task_title,
      status: task.task_status as TaskStatus,
      priority: task.task_priority as TaskPriority,
      term: task.task_term,
      createdAt: task.task_createdAt,
      commentsCount: Number(task.commentsCount) || 0,
    }));

    return {
      data: basicTasks,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
