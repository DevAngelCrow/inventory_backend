import { GlobalStatusActive } from '../value-objects/goblal-status-value-object/global-status-active';
import { GlobalStatusDescription } from '../value-objects/goblal-status-value-object/global-status-description';
import { GlobalStatusId } from '../value-objects/goblal-status-value-object/global-status-id';
import { GlobalStatusIdCategoryStatus } from '../value-objects/goblal-status-value-object/global-status-id-category-status';
import { GlobalStatusName } from '../value-objects/goblal-status-value-object/global-status-name';
import { GlobalStatusStateColor } from '../value-objects/goblal-status-value-object/global-status-state-color';
import { GlobalStatusCode } from '../value-objects/goblal-status-value-object/global-status-code';
import { GlobalStatusTextColor } from '../value-objects/goblal-status-value-object/global-status-text-color';

export class GlobalStatus {
  constructor(
    private readonly name: GlobalStatusName,
    private readonly description: GlobalStatusDescription,
    private readonly code: GlobalStatusCode,
    private readonly active: GlobalStatusActive,
    private readonly state_color: GlobalStatusStateColor,
    private readonly text_color: GlobalStatusTextColor,
    private readonly id_category_status: GlobalStatusIdCategoryStatus,
    private readonly id?: GlobalStatusId,
  ) {}
  static create(data: {
    id?: string;
    name: string;
    description: string;
    code: string;
    active: boolean;
    state_color: string;
    text_color: string;
    id_category_status: string;
  }): GlobalStatus {
    return new GlobalStatus(
      new GlobalStatusName(data.name),
      new GlobalStatusDescription(data.description),
      new GlobalStatusCode(data.code),
      new GlobalStatusActive(data.active),
      new GlobalStatusStateColor(data.state_color),
      new GlobalStatusTextColor(data.text_color),
      new GlobalStatusIdCategoryStatus(data.id_category_status),
      data.id ? new GlobalStatusId(data.id) : undefined,
    );
  }
  public getId(): GlobalStatusId | undefined {
    return this.id;
  }
  public getName(): GlobalStatusName {
    return this.name;
  }
  public getDescription(): GlobalStatusDescription {
    return this.description;
  }
  public getCode(): GlobalStatusCode {
    return this.code;
  }
  public getActive(): GlobalStatusActive {
    return this.active;
  }
  public getStateColor(): GlobalStatusStateColor {
    return this.state_color;
  }
  public getTextColor(): GlobalStatusTextColor {
    return this.text_color;
  }
  public getIdCategoryStatus(): GlobalStatusIdCategoryStatus {
    return this.id_category_status;
  }
}
