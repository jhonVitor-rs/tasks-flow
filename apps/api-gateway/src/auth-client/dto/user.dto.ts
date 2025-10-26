import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '@repo/core';

export class UserDto implements IUser {
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

  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@example.com',
    type: String,
    format: 'email',
  })
  @Expose()
  email: string;
}
