import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserInformationQuery } from './get-user-information.query';
import { IUser } from '@repo/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@QueryHandler(GetUserInformationQuery)
export class GetUserInformationHandler
  implements IQueryHandler<GetUserInformationQuery, IUser>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute(query: GetUserInformationQuery): Promise<IUser> {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: query.id } });
      if (!user) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }

      return user;
    });
  }
}
