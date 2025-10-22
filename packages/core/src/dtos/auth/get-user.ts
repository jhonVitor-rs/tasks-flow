import { Expose } from "class-transformer";

export class GetUser {
  @Expose()
  id!: string

  @Expose()
  name!: string

  @Expose()
  email!: string
}
