import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmModuleOptions } from './typeorm.config';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AuthModule,
    JwtTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
