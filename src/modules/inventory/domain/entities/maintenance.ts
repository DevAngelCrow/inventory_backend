import { randomUUID } from 'crypto';
import { MaintenanceId } from '../value-objects/maintenance-value-object/maintenance-id';
import { MaintenanceDescription } from '../value-objects/maintenance-value-object/maintenance-description';
import { MaintenanceCost } from '../value-objects/maintenance-value-object/maintenance-cost';
import { MaintenanceQuantity } from '../value-objects/maintenance-value-object/maintenance-quantity';
import { MaintenanceDateStart } from '../value-objects/maintenance-value-object/maintenance-date-start';
import { MaintenanceDateEnd } from '../value-objects/maintenance-value-object/maintenance-date-end';
import { MaintenanceResolved } from '../value-objects/maintenance-value-object/maintenance-resolved';
import { MaintenanceCreatedAt } from '../value-objects/maintenance-value-object/maintenance-created-at';
import { MaintenanceUpdatedAt } from '../value-objects/maintenance-value-object/maintenance-updated-at';
import { ProductId } from '../value-objects/product-value-object/product-id';

export class Maintenance {
  private id: MaintenanceId;
  private description: MaintenanceDescription;
  private cost: MaintenanceCost;
  private quantity: MaintenanceQuantity;
  private date_start: MaintenanceDateStart;
  private date_end: MaintenanceDateEnd;
  private resolved: MaintenanceResolved;
  private created_at: MaintenanceCreatedAt;
  private updated_at: MaintenanceUpdatedAt;
  private id_product: ProductId;

  constructor(
    id: MaintenanceId,
    description: MaintenanceDescription,
    cost: MaintenanceCost,
    quantity: MaintenanceQuantity,
    date_start: MaintenanceDateStart,
    date_end: MaintenanceDateEnd,
    resolved: MaintenanceResolved,
    created_at: MaintenanceCreatedAt,
    updated_at: MaintenanceUpdatedAt,
    id_product: ProductId,
  ) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.quantity = quantity;
    this.date_start = date_start;
    this.date_end = date_end;
    this.resolved = resolved;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.id_product = id_product;
  }

  public static create(
    description: string,
    cost: number | null,
    quantity: number,
    date_start: Date,
    date_end: Date | null,
    id_product: string,
  ): Maintenance {
    return new Maintenance(
      new MaintenanceId(randomUUID()),
      new MaintenanceDescription(description),
      new MaintenanceCost(cost),
      new MaintenanceQuantity(quantity),
      new MaintenanceDateStart(date_start),
      new MaintenanceDateEnd(date_end),
      new MaintenanceResolved(false), // default resolved
      new MaintenanceCreatedAt(new Date()),
      new MaintenanceUpdatedAt(null),
      new ProductId(id_product),
    );
  }

  public resolve(date_end: Date, cost: number | null): void {
    if (this.resolved.value()) {
      throw new Error('Maintenance is already resolved');
    }
    this.resolved = new MaintenanceResolved(true);
    this.date_end = new MaintenanceDateEnd(date_end);
    if (cost !== undefined && cost !== null) {
      this.cost = new MaintenanceCost(cost);
    }
    this.updated_at = new MaintenanceUpdatedAt(new Date());
  }

  public update(
    description: string,
    quantity: number,
    date_start: Date,
    id_product: string,
    cost?: number | null,
  ): void {
    if (this.resolved.value()) {
      throw new Error('Cannot update a resolved maintenance');
    }
    this.description = new MaintenanceDescription(description);
    this.quantity = new MaintenanceQuantity(quantity);
    this.date_start = new MaintenanceDateStart(date_start);
    this.id_product = new ProductId(id_product);
    if (cost !== undefined) {
      this.cost = new MaintenanceCost(cost === null ? null : cost);
    }
    this.updated_at = new MaintenanceUpdatedAt(new Date());
  }

  // Getters
  public getId(): MaintenanceId {
    return this.id;
  }

  public getDescription(): MaintenanceDescription {
    return this.description;
  }

  public getCost(): MaintenanceCost {
    return this.cost;
  }

  public getQuantity(): MaintenanceQuantity {
    return this.quantity;
  }

  public getDateStart(): MaintenanceDateStart {
    return this.date_start;
  }

  public getDateEnd(): MaintenanceDateEnd {
    return this.date_end;
  }

  public getResolved(): MaintenanceResolved {
    return this.resolved;
  }

  public getCreatedAt(): MaintenanceCreatedAt {
    return this.created_at;
  }

  public getUpdatedAt(): MaintenanceUpdatedAt {
    return this.updated_at;
  }

  public getIdProduct(): ProductId {
    return this.id_product;
  }
}
