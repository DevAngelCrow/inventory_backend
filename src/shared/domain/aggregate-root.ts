export interface DomainEvent {}

export abstract class AggregateRoot<EventBase extends DomainEvent = DomainEvent> {
  private readonly internalEvents: EventBase[] = [];
  public autoCommit = false;

  publish<T extends EventBase = EventBase>(event: T): void {}

  publishAll<T extends EventBase = EventBase>(events: T[]): void {}

  commit(): void {
    this.publishAll(this.internalEvents);
    this.internalEvents.length = 0;
  }

  uncommit(): void {
    this.internalEvents.length = 0;
  }

  getUncommittedEvents(): EventBase[] {
    return this.internalEvents;
  }

  loadFromHistory(history: EventBase[]): void {
    history.forEach((event) => this.apply(event, true));
  }

  apply<T extends EventBase = EventBase>(event: T, isFromHistory = false): void {
    if (!isFromHistory && !this.autoCommit) {
      this.internalEvents.push(event);
    }
    this.autoCommit && this.publish(event);

    const handler = this.getEventHandler(event);
    if (handler) {
      handler.call(this, event);
    }
  }

  protected getEventHandler<T extends EventBase = EventBase>(
    event: T,
  ): Function | undefined {
    const handler = `on${this.getEventName(event)}`;
    return (this as unknown as Record<string, Function>)[handler];
  }

  protected getEventName(event: EventBase): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }
}
