import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const url = configService.get('FRONTEND_URL', '*');
  console.log(url);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: configService.get('FRONTEND_URL', '*'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const rabbitUrl = configService.get<string>('RABBITMQ_URL');
  const gatewayQueue = configService.get<string>('GATEWAY_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: gatewayQueue,
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 1,
      heartbeatIntervalInSeconds: 30,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('TasksFlow API Gateway')
    .setDescription('API Gateway documentation for task & notification system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') ?? 3000);

  console.log(
    `🚀 Gateway running at: http://localhost:${configService.get('PORT')}`,
  );
  console.log(`📘 Swagger: http://localhost:${configService.get('PORT')}/docs`);
}
bootstrap();
