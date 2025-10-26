import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment message content',
    example: 'This task needs a unit test for the new service layer.',
    type: String,
  })
  @IsString()
  @Length(1, 500, { message: 'Message must be between 1 and 500 characters.' })
  @Expose()
  message: string;

  @ApiProperty({
    description: 'Unique identifier of the author who created the comment',
    example: 'user_123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'authorId must be a valid UUID v4.' })
  @Expose()
  authorId: string;
}
