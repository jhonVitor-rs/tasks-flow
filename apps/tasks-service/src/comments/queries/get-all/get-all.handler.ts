import { DataSource } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { IComment, IPagination, IUser } from '@repo/core';
import { GetAllCommentsQuery } from './get-all.query';
import { Comment } from 'src/comments/entities/comment.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { UserLoaderService } from 'src/common/user-loader/user-loader.service';

@QueryHandler(GetAllCommentsQuery)
export class GetAllCommentsHandler
  implements IQueryHandler<GetAllCommentsQuery, IPagination<IComment>>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userLoader: UserLoaderService,
  ) {}

  async execute(query: GetAllCommentsQuery): Promise<IPagination<IComment>> {
    const { taskId, page, size } = query.query;

    const taskExists = await this.dataSource.manager.existsBy(Task, {
      id: taskId,
    });

    if (!taskExists) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Task not found',
      });
    }

    const queryBuilder = this.dataSource
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .where('comment.taskId = :taskId', { taskId })
      .orderBy('comment.createdAt', 'DESC');

    const total = await queryBuilder.getCount();

    const skip = (page - 1) * size;
    const comments = await queryBuilder.skip(skip).take(size).getMany();

    const authorIds = [...new Set(comments.map((c) => c.authorId))];
    const authors = await this.loadAuthorsInBatch(authorIds);

    const data = comments.map((comment) => {
      const author = authors.get(comment.authorId);
      return {
        id: comment.id,
        message: comment.message,
        taskId: comment.taskId,
        author: {
          id: comment.authorId,
          name: author,
        },
        createdAt: comment.createdAt,
      } as IComment;
    });

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  private async loadAuthorsInBatch(
    userIds: string[],
  ): Promise<Map<string, string>> {
    if (userIds.length === 0) {
      return new Map();
    }

    try {
      const users = await Promise.all(
        userIds.map(async (id) => {
          try {
            const user = await this.userLoader.loadUser(id);
            return user;
          } catch (error) {
            console.warn(`Erro ao buscar usuário ${id}`);
            return null;
          }
        }),
      );

      const authorsMap = new Map<string, string>();
      users
        .filter((u): u is IUser => u !== null)
        .forEach((user) => {
          authorsMap.set(user.id, user.name);
        });

      return authorsMap;
    } catch (error) {
      console.error('Erro ao carregar autores em lote:', error);
      return new Map();
    }
  }
}
