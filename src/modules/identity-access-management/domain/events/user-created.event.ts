export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly idPeople: string,
    public readonly idStatus: string,
    public readonly isValidated: boolean,
  ) {}
}
