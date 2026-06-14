import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { ReservationController } from './infrastructure/controllers/reservation.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { InspectionsModule } from './inspections/inspections.module';

@Module({
  imports: [
    RouterModule.register([{ path: 'reservations', module: ReservationsModule }]),
    CqrsModule,
    InspectionsModule,
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
