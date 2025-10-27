import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Notification]),
    ClientsModule.registerAsync([
      {
        name: 'GATEWAY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://admin:admin@localhost:5672',
              ),
            ],
            queue: configService.get<string>('GATEWAY_QUEUE', 'gateway_queue'),
            queueOptions: {
              durable: true,
            },
            noAck: true,
          },
        }),
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class NotificationsModule {}
