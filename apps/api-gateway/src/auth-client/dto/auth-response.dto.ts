import { Expose } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IAuthResponse } from '@repo/core';
import { UserDto } from './user.dto';

export class AuthResponseDto implements IAuthResponse {
  @ApiProperty({
    description: 'Authenticated user data',
    type: UserDto,
  })
  @Expose()
  user: UserDto;

  @ApiProperty({
    description: 'JWT access token for authentication in requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @Expose()
  accessToken: string;

  @ApiHideProperty()
  refreshToken: string;
}
