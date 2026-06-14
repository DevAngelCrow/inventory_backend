import { CategoryStatusActive } from '../value-objects/category-status-value-object/category-status-active';
import { CategoryStatusCode } from '../value-objects/category-status-value-object/category-status-code';
import { CategoryStatusDescription } from '../value-objects/category-status-value-object/category-status-descritpion';
import { CategoryStatusId } from '../value-objects/category-status-value-object/category-status-id';
import { CategoryStatusName } from '../value-objects/category-status-value-object/category-status-name';

export class CategoryStatus {
  constructor(
    private readonly name: CategoryStatusName,
    private readonly code: CategoryStatusCode,
    private readonly description: CategoryStatusDescription,
    private readonly active: CategoryStatusActive,
    private readonly id?: CategoryStatusId,
  ) {}

  static create(data: {
    name: string;
    code: string;
    description: string;
    active: boolean;
    id?: string;
  }): CategoryStatus {
    return new CategoryStatus(
      new CategoryStatusName(data.name),
      new CategoryStatusCode(data.code),
      new CategoryStatusDescription(data.description),
      new CategoryStatusActive(data.active),
      data.id ? new CategoryStatusId(data.id) : undefined,
    );
  }
  public getName(): CategoryStatusName {
    return this.name;
  }

  public getCode(): CategoryStatusCode {
    return this.code;
  }

  public getDescription(): CategoryStatusDescription {
    return this.description;
  }

  public getActive(): CategoryStatusActive {
    return this.active;
  }
  public getId(): CategoryStatusId | undefined {
    return this.id;
  }
}
