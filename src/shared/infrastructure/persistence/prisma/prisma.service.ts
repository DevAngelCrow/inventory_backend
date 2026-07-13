import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

import { PrismaClient } from '../../../../../generated/prisma/client';
import { TransactionClient } from '../../../../../generated/prisma/internal/prismaNamespace';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { TransactionContextService } from '../../services/transaction-context.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('template-project:prisma');
  private prisma: PrismaClient;

  constructor(
    private readonly transactionContext: TransactionContextService,
    private readonly configService: ConfigService,
  ) {
    const dbUserRaw =
      configService.get<string>('DB_USER') ||
      process.env.POSTGRES_USER ||
      'postgres';
    const dbPasswordRaw =
      configService.get<string>('DB_PASSWORD') ||
      process.env.POSTGRES_PASSWORD ||
      '';
    const dbName =
      configService.get<string>('DB_NAME') ||
      process.env.POSTGRES_DB ||
      'postgres';
    const dbHost =
      configService.get<string>('DATABASE_HOST') ||
      configService.get<string>('DB_HOST') ||
      'postgres';
    const dbPort = configService.get<string>('DB_PORT') || '5432';
    const dbProvider = configService.get<string>('DB_PROVIDER') || 'postgresql';
    const dbUser = encodeURIComponent(dbUserRaw);
    const dbPassword = encodeURIComponent(dbPasswordRaw);
    const connectionString = `${dbProvider}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;

    process.env.DATABASE_URL = connectionString;

    const pool = new Pool({
      connectionString,
      // Tunable via env so we can right-size the pool per environment and
      // avoid exceeding Postgres max_connections when scaling horizontally.
      max: configService.get<number>('DATABASE_POOL_MAX') ?? 10,
      idleTimeoutMillis:
        configService.get<number>('DATABASE_POOL_IDLE_TIMEOUT_MS') ?? 30_000,
      connectionTimeoutMillis:
        configService.get<number>('DATABASE_POOL_CONN_TIMEOUT_MS') ?? 5_000,
    });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.logger.log('Prisma connected successfully');
    } catch (error) {
      this.logger.error('Error connecting Prisma', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.logger.log('Prisma disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting Prisma', error);
      throw error;
    }
  }
  // Returns the active transaction client when one is bound to the current
  // AsyncLocalStorage scope; otherwise returns this Prisma instance so callers
  // get the same surface either way.
  get client(): TransactionClient | PrismaClient {
    return this.transactionContext.getTransaction() ?? this.prisma;
  }

  async $transaction<T>(
    ...args: Parameters<PrismaClient['$transaction']>
  ): Promise<T> {
    return Reflect.apply(
      this.prisma.$transaction,
      this.prisma,
      args,
    ) as Promise<T>;
  }
}
