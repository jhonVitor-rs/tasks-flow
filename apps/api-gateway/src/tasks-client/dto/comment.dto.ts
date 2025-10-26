import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IComment } from '@repo/core';
import { IsUUID, IsString, Length, IsDate } from 'class-validator';

class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4')
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  @Expose()
  name: string;
}

export class CommentDto implements IComment {
  @ApiProperty({
    description: 'Unique comment identifier',
    example: '987e6543-e21b-45d3-a456-426614174999',
    type: String,
  })
  @IsUUID('4')
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'This task should include integration tests.',
    type: String,
  })
  @IsString()
  @Length(1, 500)
  @Expose()
  message: string;

  @ApiProperty({
    description: 'Identifier of the task this comment belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4')
  @Expose()
  taskId: string;

  @ApiProperty({
    description: 'Author information of the comment',
    type: () => User,
  })
  @Expose()
  @Type(() => User)
  author: User;

  @ApiProperty({
    description: 'Date and time when the comment was created',
    example: '2025-10-21T15:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Expose()
  createdAt: Date;
}
