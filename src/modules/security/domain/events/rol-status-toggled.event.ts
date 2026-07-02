export class RolStatusToggledEvent {
  constructor(
    public readonly id: string,
    public readonly statusId: string,
  ) {}
}
