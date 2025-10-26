import { AUTH_PATTERNS } from '@repo/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type {
  IRegisterUser,
  ILoginUser,
  IAuthResponse,
  IUser,
} from '@repo/core';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import { LoginUserCommand } from './commands/login-user/login-user.command';
import { RefreshAccessTokenCommand } from './commands/refresh-access-token/refresh-access-token.command';
import { ConfirmUserExistsQuery } from './queries/confirm-user-exists/confirm-user-exists.query';
import { GetUserInformationQuery } from './queries/get-user-information/get-user-information.query';
import { GetAllUsersQuery } from './queries/get-all-users/get-all-users.query';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@Controller()
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtTokenService,
  ) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER_USER)
  async registerUser(@Payload() dto: IRegisterUser): Promise<IAuthResponse> {
    const command = new RegisterUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN_USER)
  async loginUser(@Payload() dto: ILoginUser): Promise<IAuthResponse> {
    const command = new LoginUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshToken(@Payload() data: { token: string }): Promise<string> {
    const command = new RefreshAccessTokenCommand(data.token);
    return await this.commandBus.execute(command);
  }

  @MessagePattern(AUTH_PATTERNS.CONFIRM_EXISTANCE_USER)
  async checkUser(@Payload() data: { id: string }): Promise<boolean> {
    const query = new ConfirmUserExistsQuery(data.id);
    return await this.queryBus.execute(query);
  }

  @MessagePattern(AUTH_PATTERNS.GET_USER_INFORMATION)
  async getUserInformation(@Payload() data: { id: string }): Promise<IUser> {
    const query = new GetUserInformationQuery(data.id);
    return await this.queryBus.execute(query);
  }

  @MessagePattern(AUTH_PATTERNS.GET_ALL_USER)
  async getAllUsers(): Promise<IUser[]> {
    const query = new GetAllUsersQuery();
    return await this.queryBus.execute(query);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_ACCESS_TOKEN)
  async validateAccessToken(
    @Payload() data: { token: string },
  ): Promise<{ valid: boolean; userId: string }> {
    return this.jwtService.validateToken(data.token);
  }
}
