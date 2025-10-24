import { TaskPriority } from "../../constants/task-priority.enum";
import { TaskStatus } from "../../constants/task-status.enum";

export interface IBasicTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  term: Date
  createdAt: Date;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  term: Date;
  assignees: {
    id: string;
    name: string;
  }[]
  createdBy: {
    id: string;
    name: string
  }
  createdAt: Date
  updatedAt: Date
}
