import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
