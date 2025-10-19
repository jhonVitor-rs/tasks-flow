import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskStatus } from "../../constants/task-status.enum";
import { TaskPriority } from "../../constants/task-priority.enum";

export class CreateTasksDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsNotEmpty()
  @IsDateString()
  term!: string;

  @IsNotEmpty()
  @IsUUID()
  createdBy!: string;
}
