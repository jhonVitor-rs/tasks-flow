import { ApiProperty } from '@nestjs/swagger';
import { IPagination } from '@repo/core';

export class PaginationResponseDto<T = any> implements IPagination<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray: true,
    type: 'array',
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    type: Number,
  })
  size: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 10,
    minimum: 0,
    type: Number,
  })
  totalPages: number;
}
