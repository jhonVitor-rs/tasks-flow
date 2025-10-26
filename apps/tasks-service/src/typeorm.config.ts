import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { baseConfig } from '@repo/db';
import { Task } from './tasks/entities/task.entity';
import { Comment } from './comments/entities/comment.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  ...baseConfig,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
};

export const typeOrmModuleOptions: DataSourceOptions = {
  ...baseConfig,
  entities: [Task, Comment],
  synchronize: process.env.NODE_ENV !== 'production',
};

export default new DataSource(dataSourceOptions);
