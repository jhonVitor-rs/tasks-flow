import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const rabbitmqUrl = configService.get<string>(
    'RABBITMQ_URL',
    'amqp://admin:admin@localhost:5672',
  );
  const notificationQueue = configService.get<string>(
    'NOTIFICATION_QUEUE',
    'notification_queue',
  );

  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: notificationQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  console.log('Tasks microservices is listening...');
}
bootstrap();
