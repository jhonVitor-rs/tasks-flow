import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IBasicTask, ITask, TaskPriority, TaskStatus } from '@repo/core';
import { Expose, Type } from 'class-transformer';

export class BasicTaskDto implements IBasicTask {
  @ApiProperty({
    description: 'Unique task identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Implement backend',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Task state status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.TODO,
  })
  @Expose()
  status: TaskStatus;

  @ApiProperty({
    description: 'Task priority level',
    enum: TaskPriority,
    enumName: 'TaskPriority',
    example: TaskPriority.HIGH,
  })
  @Expose()
  priority: TaskPriority;

  @ApiProperty({
    description: 'Task due date',
    example: '2025-12-31T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  term: Date;

  @ApiProperty({
    description: 'Total number of comments the task has',
    type: Number,
    example: 2,
  })
  @Expose()
  commentsCount: number;

  @ApiProperty({
    description: 'Task creation date',
    example: '2025-10-20T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;
}

class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
    type: String,
  })
  @Expose()
  name: string;
}

export class TaskDto implements ITask {
  @ApiProperty({
    description: 'Unique task identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Implement backend',
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    description: 'Brief description adding task details',
    example: 'Backend must be implemented using NestJs',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Task state status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.TODO,
  })
  @Expose()
  status: TaskStatus;

  @ApiProperty({
    description: 'Task priority level',
    enum: TaskPriority,
    enumName: 'TaskPriority',
    example: TaskPriority.HIGH,
  })
  @Expose()
  priority: TaskPriority;

  @ApiProperty({
    description: 'Task due date',
    example: '2025-12-31T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  term: Date;

  @ApiProperty({
    description: 'Task creator',
    type: () => User,
    example: {
      id: 'user_123e4567-e89b-12d3-a456-426614174000',
      name: 'João Silva',
    },
  })
  @Expose()
  @Type(() => User)
  createdBy: User;

  @ApiProperty({
    description: 'List of users assigned to the task',
    type: () => [User],
    example: [
      {
        id: 'user_123e4567-e89b-12d3-a456-426614174001',
        name: 'Maria Souza',
      },
      {
        id: 'user_123e4567-e89b-12d3-a456-426614174002',
        name: 'Carlos Lima',
      },
    ],
  })
  @Expose()
  @Type(() => User)
  assignees: User[];

  @ApiProperty({
    description: 'Task creation date',
    example: '2025-10-20T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date (ISO 8601)',
    example: '2025-10-21T15:30:00Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  updatedAt: Date;
}
