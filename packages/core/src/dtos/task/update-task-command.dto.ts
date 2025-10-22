import {
  IsArray,
  IsDateString,
  IsEnum,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TaskStatus } from '../../constants/task-status.enum';
import { TaskPriority } from '../../constants/task-priority.enum';

class BaseTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title!: string;

  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsDateString()
  term!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];
}

export class UpdateTaskDto extends PartialType(BaseTaskDto) {}

export class UpdateTaskCommandDto extends PartialType(BaseTaskDto) {
  @IsString()
  @IsUUID()
  id!: string
}
