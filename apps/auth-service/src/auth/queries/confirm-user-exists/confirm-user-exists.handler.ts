import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConfirmUserExistsQuery } from './confirm-user-exists.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@QueryHandler(ConfirmUserExistsQuery)
export class ConfirmUserExistsHandler
  implements IQueryHandler<ConfirmUserExistsQuery, boolean>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: ConfirmUserExistsQuery): Promise<boolean> {
    return this.userRepository.existsBy({ id: query.id });
  }
}
