import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { AuditLogService } from './application/services/audit-log.service';
import { repositories } from './infrastructure/config/repositories.config';
import { services } from './infrastructure/config/services.config';
import { PrismaModule } from '@/shared/infrastructure/persistence/prisma/prisma.module';
import { AuditableInterceptor } from './infrastructure/interceptors/auditable.interceptor';
import { AuditController } from './infrastructure/controllers/audit.controller';
import { GetAuditLogsHandler } from './application/queries/get-audit-logs/get-audit-logs.handler';

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    RouterModule.register([{ path: 'audit', module: AuditModule }]),
  ],
  controllers: [AuditController],
  providers: [
    ...services,
    AuditableInterceptor,
    GetAuditLogsHandler,
    ...repositories,
  ],
  exports: [AuditLogService, AuditableInterceptor],
})
export class AuditModule {}
