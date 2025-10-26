import { type Request, type Response } from 'express';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AUTH_PATTERNS, IAuthResponse, IUser } from '@repo/core';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthClientController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshTokenCookie(response: Response, token: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private clearRefreshTokenCookie(response: Response) {
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  private handleMicroserviceError(error: any) {
    const status = error?.status || error?.statusCode || 500;
    const message = error?.message || 'An error occurred';

    switch (status) {
      case 400:
        throw new BadRequestException(message);
      case 401:
        throw new UnauthorizedException(message);
      case 409:
        throw new ConflictException(message);
      default:
        console.error('Microservice error:', error);
        throw new InternalServerErrorException('Internal server error');
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Creates a new user account and returns the authentication tokens. The refresh token is stored in an httpOnly cookie.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async registerUser(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    try {
      const result: IAuthResponse = await lastValueFrom(
        this.authClient
          .send(AUTH_PATTERNS.REGISTER_USER, dto)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      this.setRefreshTokenCookie(response, result.refreshToken);

      return plainToInstance(AuthResponseDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user',
    description:
      'Logs in the user and returns authentication tokens. The refresh token is stored in an httpOnly cookie.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async loginUser(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    try {
      const result: IAuthResponse = await lastValueFrom(
        this.authClient
          .send(AUTH_PATTERNS.LOGIN_USER, dto)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      this.setRefreshTokenCookie(response, result.refreshToken);

      return plainToInstance(AuthResponseDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Renew access token',
    description:
      'Generates a new access token using the refresh token stored in the cookie.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token successfully renewed',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'New JWT Access Token',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token not found or invalid',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies['refresh_token'];
    console.log(refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const result: string = await lastValueFrom(
        this.authClient
          .send(AUTH_PATTERNS.REFRESH_TOKEN, { token: refreshToken })
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      return {
        accessToken: result,
      };
    } catch (error) {
      this.clearRefreshTokenCookie(response);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('/all_users')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all users',
    description:
      'Returns a list of all registered users. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User list returned successfully',
    type: [UserDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
  })
  async getAllUsers(): Promise<UserDto[]> {
    try {
      const users: IUser[] = await lastValueFrom(
        this.authClient
          .send(AUTH_PATTERNS.GET_ALL_USER, {})
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      return users.map((user) =>
        plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
