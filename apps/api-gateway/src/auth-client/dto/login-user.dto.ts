import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ILoginUser } from '@repo/core';

export class LoginUserDto implements ILoginUser {
  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@example.com',
    minLength: 5,
    maxLength: 50,
    format: 'email',
    type: String,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password for authentication',
    example: 'Senha@123',
    minLength: 8,
    maxLength: 20,
    type: String,
    format: 'password',
  })
  @IsString()
  password: string;
}
