import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { ProfileModule } from '../profile/profile.module';
import { StorageModule } from '../storage/storage.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { repositories } from './infrastructure/config/repositories.config';
import { serviceProviders } from './infrastructure/config/services.config';
import { RouterModule } from '@nestjs/core';
import { IdentityAccessManagementModule } from '../identity-access-management/identity-access-management.module';
import { SecurityModule } from '../security/security.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUE_NAMES } from '@/shared/infrastructure/queues/queues.constants';
import { CqrsModule } from '@nestjs/cqrs';
import { AuditModule } from '../audit/audit.module';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { LoginThrottleGuard } from './infrastructure/guards/login-throttle.guard';

@Module({
  imports: [
    RouterModule.register([{ path: 'auth', module: AuthModule }]),
    CqrsModule,
    AuditModule,
    ProfileModule,
    StorageModule,
    IdentityAccessManagementModule,
    PassportModule,
    SecurityModule,
    CatalogsModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ??
            '1d') as import('ms').StringValue,
        },
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.SEND_EMAIL_VERIFICATION,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.SEND_PASSWORD_RESET,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.SEND_EMAIL_VERIFICATION,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.SEND_PASSWORD_RESET,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...serviceProviders,
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    LoginThrottleGuard,
  ],
  exports: [...serviceProviders, ...repositories],
})
export class AuthModule { }
