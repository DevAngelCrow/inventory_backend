import { InspectionDto, DamageItemDto } from '@/modules/reservations/inspections/application/dtos/inspection.dto';

export class DamageItemHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_product: string,
    public readonly damage_type: string,
    public readonly description: string,
    public readonly quantity_affected: number,
    public readonly charge_amount: number,
    public readonly id_inspection?: string,
    public readonly photo_url?: string,
  ) {}
}

export class InspectionHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_reservation: string,
    public readonly inspection_date: Date,
    public readonly overall_condition: string,
    public readonly status: { id: string; code: string; name: string; state_color: string; text_color: string; },
    public readonly general_notes?: string,
    public readonly total_charges?: number,
    public readonly id_inspected_by?: string,
    public readonly damage_items: DamageItemHttpDto[] = [],
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}

  public static fromDto(dto: InspectionDto): InspectionHttpDto {
    return new InspectionHttpDto(
      dto.id!,
      dto.id_reservation,
      dto.inspection_date,
      dto.overall_condition,
      dto.status,
      dto.general_notes,
      dto.total_charges,
      dto.id_inspected_by,
      dto.damage_items.map((d: DamageItemDto) => new DamageItemHttpDto(
        d.id!,
        d.id_product,
        d.damage_type,
        d.description,
        d.quantity_affected,
        d.charge_amount,
        d.id_inspection,
        d.photo_url,
      )),
      dto.created_at,
      dto.updated_at,
    );
  }
}
