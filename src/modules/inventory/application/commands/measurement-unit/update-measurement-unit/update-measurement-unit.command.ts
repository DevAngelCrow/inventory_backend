export class UpdateMeasurementUnitCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly active: boolean,
  ) {}
}
