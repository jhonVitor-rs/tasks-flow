import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@repo/core';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'User ID who performs the modification',
    example: 'user_123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  @Expose()
  modifiedBy: string;

  @ApiPropertyOptional({
    description: 'Updated task title',
    example: 'Refactor backend authentication module',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Expose()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated task description',
    example: 'Adjust JWT verification and error handling in gateway',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated task status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  @Expose()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Updated task priority level',
    enum: TaskPriority,
    enumName: 'TaskPriority',
    example: TaskPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  @Expose()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Updated task due date (ISO 8601 format)',
    example: '2025-11-15T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  @Expose()
  term?: string;

  @ApiPropertyOptional({
    description: 'List of new assignee user IDs',
    example: [
      'user_123e4567-e89b-12d3-a456-426614174001',
      'user_123e4567-e89b-12d3-a456-426614174002',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Expose()
  assigneeIds?: string[];
}
