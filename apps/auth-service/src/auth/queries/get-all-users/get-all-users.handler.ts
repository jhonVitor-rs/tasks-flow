import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from './get-all-users.query';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from '@repo/core';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler
  implements IQueryHandler<GetAllUsersQuery, IUser[]>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(): Promise<IUser[]> {
    return await this.userRepository.find();
  }
}
