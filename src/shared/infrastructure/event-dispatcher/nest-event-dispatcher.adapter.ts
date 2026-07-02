import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { DomainEvent } from '@/shared/domain/aggregate-root';

/**
 * Implementación del EventDispatcherPort usando el EventBus de @nestjs/cqrs.
 * Toda la dependencia sobre NestJS CQRS queda confinada aquí.
 */
@Injectable()
export class NestEventDispatcherAdapter extends EventDispatcherPort {
  constructor(private readonly eventBus: EventBus) {
    super();
  }

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventBus.publish(event);
    }
  }
}
