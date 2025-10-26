import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './auth/entities/user.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { baseConfig } from '@repo/db';

config();

export const dataSourceOptions: DataSourceOptions = {
  ...baseConfig,
  entities: ['src/**/*.entity{.ts,.js'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
};

export const typeOrmModuleOptions: DataSourceOptions = {
  ...baseConfig,
  entities: [User, RefreshToken],
  synchronize: process.env.NODE_ENV !== 'production',
};

export default new DataSource(dataSourceOptions);
