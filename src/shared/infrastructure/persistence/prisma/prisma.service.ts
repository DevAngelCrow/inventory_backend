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
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('template-project:prisma');
  // private prisma: PrismaClient;

  constructor(
    private readonly transactionContext: TransactionContextService,
    private readonly configService: ConfigService,
  ) {
    const connectionString =
      configService.get<string>('NODE_ENV') === 'production'
        ? configService.get<string>('DATABASE_DIRECT_URL')!
        : `${configService.get<string>('DB_PROVIDER')}://${configService.get<string>('DB_USER')}:${configService.get<string>('DB_PASSWORD')}@${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}/${configService.get<string>('DB_NAME')}?schema=public`;
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
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Prisma connected successfully');
    } catch (error) {
      this.logger.error('Error connecting Prisma', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      this.logger.log('Prisma disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting Prisma', error);
      throw error;
    }
  }
  // Returns the active transaction client when one is bound to the current
  // AsyncLocalStorage scope; otherwise returns this Prisma instance so callers
  // get the same surface either way.
  get client(): TransactionClient | this {
    return this.transactionContext.getTransaction() ?? this;
  }
}
