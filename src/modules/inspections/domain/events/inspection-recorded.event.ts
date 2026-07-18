export class InspectionRecordedEvent {
  constructor(
    public readonly id_reservation: string,
    public readonly total_charges: number,
  ) {}
}
