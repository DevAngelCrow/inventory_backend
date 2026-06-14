import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { ReportsController } from './infrastructure/controllers/reports.controller';
import { reportsQueryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [
    RouterModule.register([{ path: 'reports', module: ReportsModule }]),
    CqrsModule,
  ],
  controllers: [ReportsController],
  providers: [...reportsQueryHandlerProviders],
  exports: [...reportsQueryHandlerProviders],
})
export class ReportsModule { }
