export class RouteCreatedEvent {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly uri: string,
    public readonly active: boolean,
    public readonly show: boolean,
    public readonly order: number,
    public readonly required_auth: boolean,
  ) {}
}
