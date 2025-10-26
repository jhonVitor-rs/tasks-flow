import { CreateTaskHandler } from './create-task/create-task.handler';
import { DeleteTaskHandler } from './delete-task/delete-task.handler';
import { UpdateTaskHandler } from './update-task/update-task.handler';

export const CommandHandlers = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
];
