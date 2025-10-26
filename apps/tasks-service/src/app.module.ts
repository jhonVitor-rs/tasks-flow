import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { typeOrmModuleOptions } from './typeorm.config';
import { CommentsModule } from './comments/comments.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    TasksModule,
    CommentsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
