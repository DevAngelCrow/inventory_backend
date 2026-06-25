export class RecordDamageItemCommand {
  constructor(
    public readonly id_product: string,
    public readonly damage_type: string,
    public readonly description: string,
    public readonly quantity_affected: number,
    public readonly charge_amount: number,
    public readonly photo_url?: string,
  ) {}
}

export class RecordInspectionCommand {
  constructor(
    public readonly id_reservation: string,
    public readonly inspection_date: Date,
    public readonly overall_condition: string,
    public readonly status: string,
    public readonly damage_items: RecordDamageItemCommand[] = [],
    public readonly general_notes?: string,
    public readonly total_charges?: number,
    public readonly id_inspected_by?: string,
  ) {}
}
