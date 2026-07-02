import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { CategoryPermissionsActive } from '../value-objects/category-permissions-value-object/category-permissions-active';
import { CategoryPermissionsDescription } from '../value-objects/category-permissions-value-object/category-permissions-description';
import { CategoryPermissionsId } from '../value-objects/category-permissions-value-object/category-permissions-id';
import { CategoryPermissionsName } from '../value-objects/category-permissions-value-object/category-permissions-name';
import { CategoryPermissionsCreatedEvent } from '../events/category-permissions-created.event';
import { CategoryPermissionsUpdatedEvent } from '../events/category-permissions-updated.event';
import { CategoryPermissionsStatusToggledEvent } from '../events/category-permissions-status-toggled.event';

export class CategoryPermissions extends AggregateRoot {
  constructor(
    private name: CategoryPermissionsName,
    private description: CategoryPermissionsDescription,
    private active: CategoryPermissionsActive,
    private id?: CategoryPermissionsId,
  ) {
    super();
  }
  public static create(data: {
    id?: string;
    name: string;
    description: string;
    active: boolean;
  }): CategoryPermissions {
    return new CategoryPermissions(
      new CategoryPermissionsName(data.name),
      new CategoryPermissionsDescription(data.description),
      new CategoryPermissionsActive(data.active),
      data?.id ? new CategoryPermissionsId(data.id) : undefined,
    );
  }

  public created() {
    this.apply(
      new CategoryPermissionsCreatedEvent(
        this.id?.value(),
        this.name.value(),
        this.description.value(),
        this.active.value(),
      ),
    );
  }

  public update(
    name: CategoryPermissionsName,
    description: CategoryPermissionsDescription,
  ) {
    this.name = name;
    this.description = description;
    this.apply(
      new CategoryPermissionsUpdatedEvent(
        this.name.value(),
        this.description.value(),
      ),
    );
  }

  public toggleStatus(newStatus: CategoryPermissionsActive) {
    this.active = newStatus;
    this.apply(new CategoryPermissionsStatusToggledEvent(this.active.value()));
  }
  getName(): CategoryPermissionsName {
    return this.name;
  }
  getDescription(): CategoryPermissionsDescription {
    return this.description;
  }
  getActive(): CategoryPermissionsActive {
    return this.active;
  }
  getId(): CategoryPermissionsId | undefined {
    return this.id;
  }
}
