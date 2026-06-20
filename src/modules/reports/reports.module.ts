import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ReportsController } from './infrastructure/controllers/reports.controller';
import { reportsQueryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [
    CqrsModule,
  ],
  controllers: [ReportsController],
  providers: [...reportsQueryHandlerProviders],
  exports: [...reportsQueryHandlerProviders],
})
export class ReportsModule { }
