import { Expose } from "class-transformer";

export class PaginationResponseDto<T> {
  @Expose()
  data!: T[]

  @Expose()
  total!: number;

  @Expose()
  page!: number;

  @Expose()
  size!: number;

  @Expose()
  totalPages!: number
}
