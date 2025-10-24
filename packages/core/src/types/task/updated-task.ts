import { TaskPriority } from "../../constants/task-priority.enum";
import { TaskStatus } from "../../constants/task-status.enum";

interface IBase {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  term: string;
  assigneeIds: string[]
}

export interface IUpdatedTask extends Partial<IBase> {
  id: string
  modifiedBy: string
}
