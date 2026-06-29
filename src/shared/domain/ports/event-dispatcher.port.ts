import { DomainEvent } from '../aggregate-root';

/**
 * Port que define el contrato para publicar eventos de dominio.
 * La implementación concreta vive en la capa de infraestructura.
 */
export abstract class EventDispatcherPort {
  abstract dispatch(events: DomainEvent[]): Promise<void>;
}
