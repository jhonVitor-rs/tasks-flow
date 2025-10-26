import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  ValidateNested,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ITasksQuery,
  TaskPriority,
  TaskQueryOrder,
  TaskStatus,
} from '@repo/core';

class TermIntervalDto {
  @ApiProperty({
    description: 'Start date for the term interval (greater than or equal)',
    example: '2025-01-01',
    format: 'date',
  })
  @IsDateString()
  gte: string;

  @ApiProperty({
    description: 'End date for the term interval (less than or equal)',
    example: '2025-12-31',
    format: 'date',
  })
  @IsDateString()
  lte: string;
}

export class TasksQueryDto implements ITasksQuery {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 10;

  @ApiPropertyOptional({
    description: 'Filter tasks by title (partial match)',
    example: 'Complete documentation',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks by status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    enumName: 'TaskStatus',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Filter tasks by priority',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    enumName: 'TaskPriority',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Filter tasks by term date interval',
    type: TermIntervalDto,
    example: { gte: '2025-01-01', lte: '2025-12-31' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TermIntervalDto)
  termInterval?: TermIntervalDto;

  @ApiPropertyOptional({
    description: 'Sorting form for tasks',
    enum: TaskQueryOrder,
    example: TaskQueryOrder.TITLE,
    enumName: 'TaskQueryOrder',
  })
  @IsOptional()
  @IsEnum(TaskQueryOrder)
  orderBy?: TaskQueryOrder;

  @ApiPropertyOptional({
    description: 'Task ordering format',
    enum: ['DESC', 'ASC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['DESC', 'ASC'])
  order?: 'DESC' | 'ASC';
}
