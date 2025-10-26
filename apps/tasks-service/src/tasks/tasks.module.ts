import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CommandHandlers } from './commands';
import { EventsHandlers } from './events';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueryHandlers } from './queries';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CommonModule,
    CqrsModule,
    TypeOrmModule.forFeature([Task]),
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
  controllers: [TasksController],
  providers: [...CommandHandlers, ...EventsHandlers, ...QueryHandlers],
})
export class TasksModule {}
