export class UpdateMaintenanceCommand {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly quantity: number,
    public readonly date_start: Date,
    public readonly id_product: string,
    public readonly cost: number | null,
  ) {}
}
