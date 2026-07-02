import '@nestjs/cqrs';

declare module '@nestjs/cqrs' {
  export interface EventPublisher {
    mergeObjectContext<T>(object: T): T;
  }
}
