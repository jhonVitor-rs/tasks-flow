import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string
}
