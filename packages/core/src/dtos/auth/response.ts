import { Expose } from "class-transformer";
import { GetUser } from "./get-user";

export class AuthResponseDto {
  @Expose()
  user!: GetUser

  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
