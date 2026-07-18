import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InspectionController } from './infrastructure/controllers/inspection.controller';
import { inspectionRepositories } from './infrastructure/config/repositories.config';
import { inspectionCommandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { inspectionQueryHandlerProviders } from './infrastructure/config/queries-handlers.config';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { NestEventDispatcherAdapter } from '@/shared/infrastructure/event-dispatcher/nest-event-dispatcher.adapter';
import { InspectionRecordedHandler } from '@/modules/billing/application/events/inspection-recorded.handler';

@Module({
  imports: [CqrsModule],
  controllers: [InspectionController],
  providers: [
    ...inspectionRepositories,
    ...inspectionCommandHandlerProviders,
    ...inspectionQueryHandlerProviders,
    InspectionRecordedHandler,
    {
      provide: EventDispatcherPort,
      useClass: NestEventDispatcherAdapter,
    },
  ],
  exports: [
    ...inspectionCommandHandlerProviders,
    ...inspectionQueryHandlerProviders,
  ],
})
export class InspectionsModule {}
