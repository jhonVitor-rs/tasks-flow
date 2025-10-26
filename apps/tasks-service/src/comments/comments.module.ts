import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentsController } from './comments.controller';
import { CommandHandlers } from './commands';
import { EventsHandlers } from './events';
import { QueryHandlers } from './queries';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CommonModule,
    CqrsModule,
    TypeOrmModule.forFeature([Comment]),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
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
            queue: configService.get<string>(
              'NOTIFICATION_QUEUE',
              'notification_queue',
            ),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [...CommandHandlers, ...EventsHandlers, ...QueryHandlers],
})
export class CommentsModule {}
