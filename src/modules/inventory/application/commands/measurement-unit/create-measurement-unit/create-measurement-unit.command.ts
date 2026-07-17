export class CreateMeasurementUnitCommand {
  constructor(
    public readonly name: string,
    public readonly abbreviation: string,
  ) {}
}
