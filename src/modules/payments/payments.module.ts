import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { PaymentController } from './infrastructure/controllers/payment.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { gatewayProviders } from './infrastructure/config/gateways.config';

@Module({
  imports: [
    RouterModule.register([{ path: 'payments', module: PaymentsModule }]),
    CqrsModule,
  ],
  controllers: [PaymentController],
  providers: [
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    ...gatewayProviders,
  ],
  exports: [
    ...commandHandlerProviders,
    ...queryHandlerProviders,
    ...gatewayProviders,
  ],
})
export class PaymentsModule {}
