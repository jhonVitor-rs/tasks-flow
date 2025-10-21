import { Expose } from "class-transformer";

export class AuthResponseDto {
  @Expose()
  user!: {
    id: string;
    name: string;
    email: string
  }

  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
