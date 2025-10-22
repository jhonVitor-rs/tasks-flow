import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  message!: string;

  @IsString()
  @IsUUID()
  authorId!: string;
}

export class CreateCommentCommandDto extends CreateCommentDto {
  @IsString()
  @IsUUID()
  taskId!: string;
}
