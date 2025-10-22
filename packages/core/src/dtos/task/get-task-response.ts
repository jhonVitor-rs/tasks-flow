import { Expose, Type } from "class-transformer";
import { TaskStatus } from "../../constants/task-status.enum";
import { TaskPriority } from "../../constants/task-priority.enum";

export class GetTaskResponse {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  status!: TaskStatus;

  @Expose()
  priority!: TaskPriority;

  @Expose()
  @Type(() => Date)
  term!: Date;

  @Expose()
  assignees!: {
    id: string;
    name: string;
  }[]; // Array de assignees

  @Expose()
  createdBy!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
