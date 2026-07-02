export class ResolveMaintenanceCommand {
  constructor(
    public readonly id: string,
    public readonly date_end: Date,
    public readonly cost: number | null,
  ) {}
}
