import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { RolCode } from '../value-objects/rol-value-object/rol-code';
import { RolDescription } from '../value-objects/rol-value-object/rol-description';
import { RolId } from '../value-objects/rol-value-object/rol-id';
import { RolIdStatus } from '../value-objects/rol-value-object/rol-id-status';
import { RolName } from '../value-objects/rol-value-object/rol-name';
import { RolCreatedEvent } from '../events/rol-created.event';
import { RolUpdatedEvent } from '../events/rol-updated.event';
import { RolStatusToggledEvent } from '../events/rol-status-toggled.event';

export class Rol extends AggregateRoot {
  constructor(
    private name: RolName,
    private description: RolDescription,
    private id_status: RolIdStatus,
    private readonly code: RolCode,
    private readonly id?: RolId,
    private id_permissions?: string[],
  ) {
    super();
  }

  public static create(data: {
    id?: string;
    name: string;
    description: string;
    id_status: string;
    code: string;
    id_permissions?: string[];
  }): Rol {
    return new Rol(
      new RolName(data.name),
      new RolDescription(data.description),
      new RolIdStatus(data.id_status),
      new RolCode(data.code),
      data.id ? new RolId(data.id) : undefined,
      data.id_permissions,
    );
  }

  public created(): void {
    if (this.id) {
      this.apply(
        new RolCreatedEvent(
          this.id.value(),
          this.name.value(),
          this.description.value(),
          this.code.value(),
          this.id_status.value(),
          this.id_permissions,
        ),
      );
    }
  }

  public update(
    name: RolName,
    description: RolDescription,
    id_permissions?: string[],
  ): void {
    this.name = name;
    this.description = description;
    this.id_permissions = id_permissions;
    if (this.id) {
      this.apply(
        new RolUpdatedEvent(
          this.id.value(),
          this.name.value(),
          this.description.value(),
          this.id_status.value(),
          this.id_permissions,
        ),
      );
    }
  }

  public toggleStatus(newStatus: RolIdStatus): void {
    this.id_status = newStatus;
    if (this.id) {
      this.apply(new RolStatusToggledEvent(this.id.value(), newStatus.value()));
    }
  }

  getName(): RolName {
    return this.name;
  }
  getDescription(): RolDescription {
    return this.description;
  }
  getIdStatus(): RolIdStatus {
    return this.id_status;
  }
  getCode(): RolCode {
    return this.code;
  }
  getId(): RolId | undefined {
    return this.id;
  }
  getIdPermissions(): string[] | undefined {
    return this.id_permissions;
  }
}
