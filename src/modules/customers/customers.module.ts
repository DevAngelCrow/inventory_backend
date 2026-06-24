import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [CqrsModule],
  controllers: [CustomerController],
  providers: [
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [...commandHandlerProviders, ...queryHandlerProviders],
})
export class CustomersModule {}
