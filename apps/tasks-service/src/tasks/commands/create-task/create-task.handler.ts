import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from './create-task.command';
import { Task } from 'src/tasks/entities/task.entity';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler
  implements ICommandHandler<CreateTaskCommand, { id: string }>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateTaskCommand): Promise<{ id: string }> {
    return this.dataSource.transaction(async (manager) => {
      const { title, term, createdBy, status, priority } = command.data;
      let task = Task.create(title, term, createdBy, status, priority);

      task = this.eventPublisher.mergeObjectContext(task);

      await manager.save(Task, task);

      task.commit();

      return { id: task.id };
    });
  }
}
