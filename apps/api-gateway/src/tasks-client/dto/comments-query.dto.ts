import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class CommentsQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 10;
}
