import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { baseConfig } from '@repo/db';
import { Notification } from './notifications/entities/notification.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  ...baseConfig,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
};

export const typeOrmModuleOptions: DataSourceOptions = {
  ...baseConfig,
  entities: [Notification],
  synchronize: process.env.NODE_ENV !== 'production',
};

export default new DataSource(dataSourceOptions);
