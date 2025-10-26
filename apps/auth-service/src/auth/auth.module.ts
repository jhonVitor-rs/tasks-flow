import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';

@Module({
  imports: [
    JwtTokenModule,
    CqrsModule,
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class AuthModule {}
