import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/persistence/prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './shared/infrastructure/health/health.module';
import { RequestIdMiddleware } from './shared/infrastructure/http/middleware/request-id.middleware';
import { IdempotencyMiddleware } from './shared/infrastructure/http/middleware/idempotency.middleware';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { ProfileModule } from './modules/profile/profile.module';
import { StorageModule } from './modules/storage/storage.module';
import { TransactionInterceptor } from './shared/infrastructure/interceptors/transaction.interceptor';
import { SecurityModule } from './modules/security/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { IdentityAccessManagementModule } from './modules/identity-access-management/identity-access-management.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { BillingModule } from './modules/billing/billing.module';
import { ReportsModule } from './modules/reports/reports.module';
import { JwtPassportAuthGuard } from './modules/auth/infrastructure/guards/jwt-passport-auth.guard';
import { PermissionsGuard } from './modules/security/infrastructure/guards/permissions.guard';
import { validate } from './shared/infrastructure/config/env.validation';
import {
  appConfig,
  databaseConfig,
  emailConfig,
  jwtConfig,
  redisConfig,
  throttlerConfig,
} from './shared/infrastructure/config/configs';
import { QueuesModule } from './shared/infrastructure/queues/queues.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoginThrottleGuard } from './modules/auth/infrastructure/guards/login-throttle.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RedisCacheModule } from './shared/infrastructure/cache/cache.module';
import { AuditModule } from './modules/audit/audit.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './shared/infrastructure/health/metrics.controller';
import { AuditableInterceptor } from './modules/audit/infrastructure/interceptors/auditable.interceptor';
import { DateModule } from './shared/infrastructure/services/date.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validate,
      load: [
        appConfig,
        databaseConfig,
        emailConfig,
        jwtConfig,
        redisConfig,
        throttlerConfig,
      ],
    }),
    PrismaModule,
    DateModule,
    QueuesModule,
    CatalogsModule,
    ProfileModule,
    StorageModule,
    SecurityModule,
    AuthModule,
    IdentityAccessManagementModule,
    InventoryModule,
    CustomersModule,
    ReservationsModule,
    PaymentsModule,
    BillingModule,
    ReportsModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'global',
            ttl: config.get<number>('THROTTLE_GLOBAL_TTL')!,
            limit: config.get<number>('THROTTLE_GLOBAL_LIMIT')!,
          },
        ],
      }),
    }),
    RedisCacheModule,
    AuditModule,
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    HealthModule,
    // Exposes /metrics with default Node process metrics (heap, gc, event loop).
    // Uses a custom controller (see MetricsController) so the route opts out of
    // global URI versioning and the JWT auth guard. The endpoint is
    // unauthenticated — network isolation lives at the reverse-proxy / network
    // policy layer, not in this app.
    PrometheusModule.register({
      controller: MetricsController,
      defaultMetrics: { enabled: true },
      defaultLabels: {
        app: 'backend-template-nest',
      },
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level:
            config.get<string>('NODE_ENV') === 'production' ? 'info' : 'debug',
          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: { colorize: true, singleLine: true },
                }
              : undefined,
          genReqId: (req: import('http').IncomingMessage) =>
            (req as import('http').IncomingMessage & { id?: string }).id ??
            'unknown',
          autoLogging: true,
          quietReqLogger: false,
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'res.headers["set-cookie"]',
              'req.body.password',
              'req.body.new_password',
              'req.body.old_password',
              'req.body.token',
              'req.body.refresh_token',
              'password',
              'token',
              'refresh_token',
              'accessToken',
              'access_token',
            ],
            censor: '[REDACTED]',
            remove: false,
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    {
      // Reads @Auditable metadata on handlers and writes to mnt_audit_log on
      // success. No-op for handlers without the decorator, so the cost on
      // unaudited routes is a single reflector lookup.
      provide: APP_INTERCEPTOR,
      useClass: AuditableInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtPassportAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: LoginThrottleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
    consumer
      .apply(IdempotencyMiddleware)
      .forRoutes(
        { path: '*path', method: RequestMethod.POST },
        { path: '*path', method: RequestMethod.PUT },
      );
  }
}
