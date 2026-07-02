import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { PermissionsActive } from '../value-objects/permissions-value-object/permissions-active';
import { PermissionsDescription } from '../value-objects/permissions-value-object/permissions-description';
import { PermissionsId } from '../value-objects/permissions-value-object/permissions-id';
import { PermissionsIdCategoryPermissions } from '../value-objects/permissions-value-object/permissions-id-category-permissions';
import { PermissionsName } from '../value-objects/permissions-value-object/permissions-name';
import { PermissionsCreatedEvent } from '../events/permissions-created.event';
import { PermissionsUpdatedEvent } from '../events/permissions-updated.event';
import { PermissionsStatusToggledEvent } from '../events/permissions-status-toggled.event';

export class Permissions extends AggregateRoot {
  constructor(
    private name: PermissionsName,
    private id_category_permissions: PermissionsIdCategoryPermissions,
    private description: PermissionsDescription,
    private active: PermissionsActive,
    private id?: PermissionsId,
  ) {
    super();
  }
  public static create(data: {
    id?: string;
    name: string;
    id_category_permissions: string;
    description: string;
    active: boolean;
  }): Permissions {
    return new Permissions(
      new PermissionsName(data.name),
      new PermissionsIdCategoryPermissions(data.id_category_permissions),
      new PermissionsDescription(data.description),
      new PermissionsActive(data.active),
      data.id ? new PermissionsId(data.id) : undefined,
    );
  }

  public created() {
    this.apply(
      new PermissionsCreatedEvent(
        this.id?.value(),
        this.name.value(),
        this.id_category_permissions.value(),
        this.description.value(),
        this.active.value(),
      ),
    );
  }

  public update(
    name: PermissionsName,
    id_category_permissions: PermissionsIdCategoryPermissions,
    description: PermissionsDescription,
  ) {
    this.name = name;
    this.id_category_permissions = id_category_permissions;
    this.description = description;
    this.apply(
      new PermissionsUpdatedEvent(
        this.name.value(),
        this.description.value(),
        this.id_category_permissions.value(),
      ),
    );
  }

  public toggleStatus(newStatus: PermissionsActive) {
    this.active = newStatus;
    this.apply(new PermissionsStatusToggledEvent(this.active.value()));
  }
  getName(): PermissionsName {
    return this.name;
  }
  getIdCategoryPermissions(): PermissionsIdCategoryPermissions {
    return this.id_category_permissions;
  }
  getDescription(): PermissionsDescription {
    return this.description;
  }
  getActive(): PermissionsActive {
    return this.active;
  }
  getId(): PermissionsId | undefined {
    return this.id;
  }
}
