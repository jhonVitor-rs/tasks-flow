import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IRegisterUser } from '@repo/core';

export class RegisterUserDto implements IRegisterUser {
  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
    minLength: 3,
    maxLength: 50,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@example.com',
    minLength: 5,
    maxLength: 50,
    format: 'email',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
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
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
