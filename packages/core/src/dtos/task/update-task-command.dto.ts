import { TaskPriority } from "../../constants/task-priority.enum";
import { TaskStatus } from "../../constants/task-status.enum";

export class UpdateTaskCommandDto {
  id!: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  term?: string;
  assigneeIds?: string[];
}
