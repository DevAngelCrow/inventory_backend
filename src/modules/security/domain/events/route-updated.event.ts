export class RouteUpdatedEvent {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly uri: string,
    public readonly show: boolean,
    public readonly order: number,
    public readonly required_auth: boolean,
  ) {}
}
