import { TaskPriority } from "../../constants/task-priority.enum";
import { TaskStatus } from "../../constants/task-status.enum";

export interface ICreateTask {
  title: string;
  status?: TaskStatus
  priority?: TaskPriority
  term: string,
  createdBy: string
}
