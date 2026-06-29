import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { NestEventDispatcherAdapter } from './nest-event-dispatcher.adapter';

/**
 * Módulo que provee la implementación del EventDispatcherPort.
 * Debe importarse en cada módulo de negocio que necesite publicar eventos de dominio.
 */
@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: EventDispatcherPort,
      useClass: NestEventDispatcherAdapter,
    },
  ],
  exports: [EventDispatcherPort],
})
export class EventDispatcherModule {}
