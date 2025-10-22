import { Type } from "class-transformer";
import { IsInt, IsString, IsUUID, Min } from "class-validator";

export class GetAllCommentsDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  size!: number;
}

export class GetAllCommentsCommandDto extends GetAllCommentsDto {
  @IsString()
  @IsUUID()
  taskId!: string
}
