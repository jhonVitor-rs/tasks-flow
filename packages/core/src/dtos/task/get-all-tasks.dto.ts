import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from "class-validator";
import { TaskPriority } from "../../constants/task-priority.enum";
import { TaskStatus } from "../../constants/task-status.enum";

class TermInterval {
  @IsDateString()
  @IsOptional()
  gte?: string;

  @IsDateString()
  @IsOptional()
  lte?: string;
}

export class GetAllTasksDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  size!: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ValidateNested()
  @Type(() => TermInterval)
  @IsOptional()
  termInterval?: TermInterval;
}
