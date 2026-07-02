import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { invoiceRepositories } from './infrastructure/config/repositories.config';
import { invoiceCommandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { invoiceQueryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { invoiceProvidersConfig } from './infrastructure/config/providers.config';

@Module({
  imports: [
    RouterModule.register([{ path: 'billing', module: BillingModule }]),
    CqrsModule,
  ],
  controllers: [InvoiceController],
  providers: [
    ...invoiceRepositories,
    ...invoiceCommandHandlerProviders,
    ...invoiceQueryHandlerProviders,
    ...invoiceProvidersConfig,
  ],
  exports: [
    ...invoiceCommandHandlerProviders,
    ...invoiceQueryHandlerProviders,
    ...invoiceProvidersConfig,
  ],
})
export class BillingModule {}
