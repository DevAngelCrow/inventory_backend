import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserController } from './infrastructure/controllers/user.controller';
import { serviceProviders } from './infrastructure/config/services.config';
import { respositories } from './infrastructure/config/repositories.config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventDispatcherModule } from '@/shared/infrastructure/event-dispatcher/event-dispatcher.module';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [
    RouterModule.register([
      { path: 'identity', module: IdentityAccessManagementModule },
    ]),
    CqrsModule,
    EventDispatcherModule,
  ],
  controllers: [UserController],
  providers: [
    ...serviceProviders,
    ...respositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [
    ...serviceProviders,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
})
export class IdentityAccessManagementModule {}
