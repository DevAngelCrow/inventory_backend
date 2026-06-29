import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventDispatcherModule } from '@/shared/infrastructure/event-dispatcher/event-dispatcher.module';
import { RouterModule } from '@nestjs/core';
import { ReservationController } from './infrastructure/controllers/reservation.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [
    RouterModule.register([
      { path: 'reservations', module: ReservationsModule },
    ]),
    CqrsModule,
    EventDispatcherModule,
  ],
  controllers: [ReservationController],
  providers: [
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [...commandHandlerProviders, ...queryHandlerProviders],
})
export class ReservationsModule {}
