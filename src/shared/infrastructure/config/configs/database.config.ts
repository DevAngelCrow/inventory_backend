import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST ?? '',
  user: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  name: process.env.DB_NAME ?? '',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  provider: process.env.DB_PROVIDER ?? 'postgresql',
  directUrl: process.env.DATABASE_DIRECT_URL,
}));
