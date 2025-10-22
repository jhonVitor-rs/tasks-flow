import { Expose } from "class-transformer";

export class CommentResponseDto {
  @Expose()
  id!: string

  @Expose()
  message!: string

  @Expose()
  taskId!: string

  @Expose()
  author!: string

  @Expose()
  createdAt!: Date
}
