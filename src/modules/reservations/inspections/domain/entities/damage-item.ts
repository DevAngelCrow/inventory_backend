import { DamageItemId } from '../value-objects/damage-item-id';
import { DamageItemQuantity } from '../value-objects/damage-item-quantity';

export class DamageItem {
  constructor(
    private readonly id_product: string,
    private readonly damage_type: string,
    private readonly description: string,
    private readonly quantity_affected: DamageItemQuantity,
    private readonly charge_amount: number,
    private readonly id_inspection?: string,
    private readonly photo_url?: string,
    private readonly id?: DamageItemId,
  ) {}

  static create(data: {
    id_product: string;
    damage_type: string;
    description: string;
    quantity_affected: number;
    charge_amount: number;
    id_inspection?: string;
    photo_url?: string;
    id?: string;
  }): DamageItem {
    return new DamageItem(
      data.id_product,
      data.damage_type,
      data.description,
      new DamageItemQuantity(data.quantity_affected),
      data.charge_amount,
      data.id_inspection,
      data.photo_url,
      data.id ? new DamageItemId(data.id) : undefined,
    );
  }

  public getId(): DamageItemId | undefined { return this.id; }
  public getIdInspection(): string | undefined { return this.id_inspection; }
  public getIdProduct(): string { return this.id_product; }
  public getDamageType(): string { return this.damage_type; }
  public getDescription(): string { return this.description; }
  public getQuantityAffected(): DamageItemQuantity { return this.quantity_affected; }
  public getChargeAmount(): number { return this.charge_amount; }
  public getPhotoUrl(): string | undefined { return this.photo_url; }
}
