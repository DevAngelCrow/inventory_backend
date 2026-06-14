import { InspectionId } from '../value-objects/inspection-id';
import { InspectionStatus } from '../value-objects/inspection-status';
import { DamageItem } from './damage-item';

export class Inspection {
  constructor(
    private readonly id_reservation: string,
    private readonly inspection_date: Date,
    private readonly overall_condition: string,
    private readonly status: InspectionStatus,
    private readonly general_notes?: string,
    private readonly total_charges?: number,
    private readonly id_inspected_by?: string,
    private readonly damage_items: DamageItem[] = [],
    private readonly id?: InspectionId,
  ) {}

  static create(data: {
    id_reservation: string;
    inspection_date: Date;
    overall_condition: string;
    status: string;
    general_notes?: string;
    total_charges?: number;
    id_inspected_by?: string;
    damage_items?: {
      id_product: string;
      damage_type: string;
      description: string;
      quantity_affected: number;
      charge_amount: number;
      photo_url?: string;
      id?: string;
    }[];
    id?: string;
  }): Inspection {
    return new Inspection(
      data.id_reservation,
      data.inspection_date,
      data.overall_condition,
      new InspectionStatus(data.status),
      data.general_notes,
      data.total_charges ?? 0,
      data.id_inspected_by,
      data.damage_items?.map((item) => DamageItem.create({ ...item, id_inspection: data.id })) ?? [],
      data.id ? new InspectionId(data.id) : undefined,
    );
  }

  public getId(): InspectionId | undefined { return this.id; }
  public getIdReservation(): string { return this.id_reservation; }
  public getInspectionDate(): Date { return this.inspection_date; }
  public getOverallCondition(): string { return this.overall_condition; }
  public getStatus(): InspectionStatus { return this.status; }
  public getGeneralNotes(): string | undefined { return this.general_notes; }
  public getTotalCharges(): number { return this.total_charges ?? 0; }
  public getIdInspectedBy(): string | undefined { return this.id_inspected_by; }
  public getDamageItems(): DamageItem[] { return this.damage_items; }
}
