import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InspectionController } from './infrastructure/controllers/inspection.controller';
import { inspectionRepositories } from './infrastructure/config/repositories.config';
import { inspectionCommandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { inspectionQueryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [CqrsModule],
  controllers: [InspectionController],
  providers: [
    ...inspectionRepositories,
    ...inspectionCommandHandlerProviders,
    ...inspectionQueryHandlerProviders,
  ],
  exports: [
    ...inspectionCommandHandlerProviders,
    ...inspectionQueryHandlerProviders,
  ],
})
export class InspectionsModule {}
