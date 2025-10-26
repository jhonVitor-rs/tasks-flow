import { Module } from '@nestjs/common';
import { TasksClientController } from './tasks-client.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientModule } from 'src/auth-client/auth-client.module';

@Module({
  imports: [
    AuthClientModule,
    ClientsModule.registerAsync([
      {
        name: 'TASKS_SERVICE',
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
            queue: configService.get<string>('TASKS_QUEUE', 'tasks_queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TasksClientController],
})
export class TasksClientModule {}
