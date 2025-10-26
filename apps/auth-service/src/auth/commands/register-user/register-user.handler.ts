import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { DataSource } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { IAuthResponse } from '@repo/core';
import { RegisterUserCommand } from './register-user.command';
import { User } from 'src/auth/entities/user.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, IAuthResponse>
{
  constructor(
    @InjectDataSource()
    private readonly dataSouce: DataSource,
    private readonly jwtService: JwtTokenService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<IAuthResponse> {
    return this.dataSouce.transaction(async (manager) => {
      // Save user
      const { name, email, password } = command.data;
      const existsUser = await manager.existsBy(User, { email });
      console.log(existsUser);
      if (existsUser) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'Email already registered to another user',
        });
      }

      const hashedPassword = await argon2.hash(password);
      const user = manager.create(User, {
        name,
        email,
        hashedPassword,
      });
      await manager.save(User, user);

      // Create access tokne
      const accessToken = this.jwtService.generateToken(user);

      // Create refresh token
      const token = crypto.randomBytes(64).toString('hex');
      const refreshToken = manager.create(RefreshToken, {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await manager.save(RefreshToken, refreshToken);

      return {
        user: user,
        accessToken: accessToken,
        refreshToken: token,
      };
    });
  }
}
