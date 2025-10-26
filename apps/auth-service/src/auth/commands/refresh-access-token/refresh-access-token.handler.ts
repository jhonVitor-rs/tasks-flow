import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshAccessTokenCommand } from './refresh-access-token.command';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@CommandHandler(RefreshAccessTokenCommand)
export class RefreshAccessTokenHandler
  implements ICommandHandler<RefreshAccessTokenCommand, string>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtTokenService,
  ) {}

  async execute(command: RefreshAccessTokenCommand): Promise<string> {
    const manager = this.dataSource.manager;

    const refreshToken = await manager.findOne(RefreshToken, {
      where: { token: command.token },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid refresh token',
      });
    }

    if (refreshToken.expiresAt <= new Date()) {
      await manager.delete(RefreshToken, { id: refreshToken.id });
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token expired',
      });
    }

    const newAccessToken = this.jwtService.generateToken(refreshToken.user);

    return newAccessToken;
  }
}
