export type DomainEvent = object;

export abstract class AggregateRoot<
  EventBase extends DomainEvent = DomainEvent,
> {
  private readonly _domainEvents: EventBase[] = [];

  protected apply(event: EventBase): void {
    this._domainEvents.push(event);
    const handler = this.getEventHandler(event);
    if (handler) {
      handler.call(this, event);
    }
  }

  getDomainEvents(): EventBase[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }

  protected getEventHandler<T extends EventBase = EventBase>(
    event: T,
  ): ((...args: unknown[]) => void) | undefined {
    const handler = `on${this.getEventName(event)}`;
    const method: unknown = Reflect.get(this, handler);
    if (typeof method === 'function') {
      return (...args: unknown[]): void => {
        Reflect.apply(method, this, args);
      };
    }
    return undefined;
  }

  protected getEventName(event: EventBase): string {
    const { constructor } = Object.getPrototypeOf(event);
    return String(constructor.name);
  }
}
