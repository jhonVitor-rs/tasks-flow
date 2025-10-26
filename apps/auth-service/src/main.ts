import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const rabbitmqUrl = configService.get<string>(
    'RABBITMQ_URL',
    'amqp://admin:admin@localhost:5672',
  );
  const authQueue = configService.get<string>('AUTH_QUEUE', 'auth_queue');

  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: authQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  console.log(`Auth microservice is listening on queue: ${authQueue}`);
}

bootstrap();
