export class CreateMaintenanceCommand {
  constructor(
    public readonly id_product: string,
    public readonly description: string,
    public readonly quantity: number,
    public readonly date_start: Date,
    public readonly date_end: Date | null,
    public readonly cost: number | null,
  ) {}
}
