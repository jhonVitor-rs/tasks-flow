import { TaskPriority } from "../../constants/task-priority.enum";
import { TaskStatus } from "../../constants/task-status.enum";

export interface ITasksQuery {
  page: number;
  size: number;
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  termInterval?: {
    gte: string;
    lte: string;
  }
}
