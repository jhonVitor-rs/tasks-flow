import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  type ITasksQuery,
  type ICreateTask,
  type IUpdatedTask,
  IBasicTask,
  IPagination,
  ITask,
  TASK_PATTERNS,
} from '@repo/core';
import { CreateTaskCommand } from './commands/create-task/create-task.command';
import { UpdateTaskCommand } from './commands/update-task/update-task.command';
import { DeleteTaskCommand } from './commands/delete-task/delete-task.command';
import { GetTaskQuery } from './queries/get-task/get-task.query';
import { GetAllTasksQuery } from './queries/get-all-tasks/get-all-tasks.query';

@Controller()
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(TASK_PATTERNS.GET_ALL_TASKS)
  async getAllTasks(
    @Payload() data: ITasksQuery,
  ): Promise<IPagination<IBasicTask>> {
    const query = new GetAllTasksQuery(data);
    return await this.queryBus.execute(query);
  }

  @MessagePattern(TASK_PATTERNS.CREATE_TASK)
  async createTask(@Payload() data: ICreateTask): Promise<{ id: string }> {
    const command = new CreateTaskCommand(data);
    return await this.commandBus.execute(command);
  }

  @MessagePattern(TASK_PATTERNS.GET_TASK)
  async getTask(@Payload() data: { id: string }): Promise<ITask> {
    const query = new GetTaskQuery(data.id);
    return await this.queryBus.execute(query);
  }

  @MessagePattern(TASK_PATTERNS.UPDATE_TASK)
  async updateTask(@Payload() data: IUpdatedTask): Promise<{ id: string }> {
    const command = new UpdateTaskCommand(data);
    return await this.commandBus.execute(command);
  }

  @MessagePattern(TASK_PATTERNS.DELETE_TASK)
  async deleteTask(
    @Payload() data: { id: string },
  ): Promise<{ success: boolean }> {
    const command = new DeleteTaskCommand(data.id);
    await this.commandBus.execute(command);
    return { success: true };
  }
}
