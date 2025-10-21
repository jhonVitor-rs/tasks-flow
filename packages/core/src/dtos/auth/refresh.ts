import { IsBase64, IsString } from "class-validator";

export class RefreshAccessTokenDto{
  @IsString()
  @IsBase64()
  token!: string;
}
