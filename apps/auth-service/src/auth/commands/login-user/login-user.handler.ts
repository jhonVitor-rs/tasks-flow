import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { DataSource } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { IAuthResponse } from '@repo/core';
import { LoginUserCommand } from './login-user.command';
import { User } from 'src/auth/entities/user.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
  implements ICommandHandler<LoginUserCommand, IAuthResponse>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtTokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<IAuthResponse> {
    return this.dataSource.transaction(async (manager) => {
      const { email, password } = command.data;

      const user = await manager.findOneBy(User, { email });
      if (!user) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credential',
        });
      }

      const isPaswordValid = await argon2.verify(user.hashedPassword, password);
      if (!isPaswordValid) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credential',
        });
      }

      const accessToken = this.jwtService.generateToken(user);

      const existingRefreshToken = await manager.findOneBy(RefreshToken, {
        userId: user.id,
      });
      if (existingRefreshToken && existingRefreshToken.expiresAt > new Date()) {
        return {
          user: user,
          accessToken: accessToken,
          refreshToken: existingRefreshToken.token,
        };
      }

      await manager.delete(RefreshToken, { userId: user.id });

      const token = crypto.randomBytes(64).toString('hex');
      const newRefreshToken = manager.create(RefreshToken, {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await manager.save(RefreshToken, newRefreshToken);

      return {
        user: user,
        accessToken: accessToken,
        refreshToken: token,
      };
    });
  }
}
