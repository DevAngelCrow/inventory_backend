export class DamageItemDto {
  constructor(
    public readonly id_product: string,
    public readonly damage_type: string,
    public readonly description: string,
    public readonly quantity_affected: number,
    public readonly charge_amount: number,
    public readonly id_inspection?: string,
    public readonly photo_url?: string,
    public readonly id?: string,
  ) {}
}

export class InspectionDto {
  constructor(
    public readonly id_reservation: string,
    public readonly inspection_date: Date,
    public readonly overall_condition: string,
    public readonly status: {
      id: string;
      code: string;
      name: string;
      state_color: string;
      text_color: string;
    },
    public readonly general_notes?: string,
    public readonly total_charges?: number,
    public readonly id_inspected_by?: string,
    public readonly damage_items: DamageItemDto[] = [],
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}
}
