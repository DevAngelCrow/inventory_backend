import { randomUUID } from 'crypto';

export class Maintenance {
  private id: string;
  private description: string;
  private cost: number | null;
  private quantity: number;
  private date_start: Date;
  private date_end: Date | null;
  private resolved: boolean;
  private created_at: Date;
  private updated_at: Date | null;
  private id_product: string;

  constructor(
    id: string,
    description: string,
    cost: number | null,
    quantity: number,
    date_start: Date,
    date_end: Date | null,
    resolved: boolean,
    created_at: Date,
    updated_at: Date | null,
    id_product: string,
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
      randomUUID(),
      description,
      cost,
      quantity,
      date_start,
      date_end,
      false, // default resolved
      new Date(),
      null,
      id_product,
    );
  }

  public resolve(date_end: Date, cost: number | null): void {
    if (this.resolved) {
      throw new Error('Maintenance is already resolved');
    }
    this.resolved = true;
    this.date_end = date_end;
    if (cost !== undefined && cost !== null) {
      this.cost = cost;
    }
    this.updated_at = new Date();
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCost(): number | null {
    return this.cost;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getDateStart(): Date {
    return this.date_start;
  }

  public getDateEnd(): Date | null {
    return this.date_end;
  }

  public getResolved(): boolean {
    return this.resolved;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date | null {
    return this.updated_at;
  }

  public getIdProduct(): string {
    return this.id_product;
  }
}
