import { AggregateRoot } from '@nestjs/cqrs';

declare module '@nestjs/cqrs' {
  export class EventPublisher {
    mergeObjectContext<T>(object: T): T;
  }
}
