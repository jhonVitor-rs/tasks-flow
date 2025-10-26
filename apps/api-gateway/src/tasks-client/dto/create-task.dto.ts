import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateTask, TaskPriority, TaskStatus } from '@repo/core';

export class CreateTaskDto implements ICreateTask {
  @ApiProperty({
    description: 'Task title',
    example: 'Implement backend module',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Task current status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.TODO,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    description: 'Task priority level',
    enum: TaskPriority,
    enumName: 'TaskPriority',
    example: TaskPriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Task due date (ISO 8601 string)',
    example: '2025-12-31T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'User ID who created the task',
    example: 'user_123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
