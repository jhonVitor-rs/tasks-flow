import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthClientModule } from './auth-client/auth-client.module';
import { TasksClientModule } from './tasks-client/tasks-client.module';
import { NotificationsClientModule } from './notifications-client/notifications-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthClientModule,
    TasksClientModule,
    NotificationsClientModule,
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL ?? '60'),
        limit: parseInt(process.env.THROTTLE_LIMIT ?? '10'),
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
