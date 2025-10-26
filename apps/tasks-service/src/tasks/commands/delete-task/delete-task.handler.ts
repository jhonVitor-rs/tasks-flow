import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from './delete-task.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler
  implements ICommandHandler<DeleteTaskCommand, void>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      const existsTask = await manager.existsBy(Task, { id: command.id });
      if (!existsTask) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Task not found',
        });
      }

      await manager.delete(Task, { id: command.id });
    });
  }
}
