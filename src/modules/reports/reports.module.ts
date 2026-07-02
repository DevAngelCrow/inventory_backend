import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ReportsController } from './infrastructure/controllers/reports.controller';
import { reportsQueryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { reportsRepositoryProviders } from './infrastructure/config/repositories.config';

@Module({
  imports: [CqrsModule],
  controllers: [ReportsController],
  providers: [...reportsQueryHandlerProviders, ...reportsRepositoryProviders],
  exports: [...reportsQueryHandlerProviders, ...reportsRepositoryProviders],
})
export class ReportsModule {}
