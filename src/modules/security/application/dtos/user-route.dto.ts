export class UserRouteDto<T> {
  constructor(
    public readonly active: boolean,
    public readonly children: T[],
    public readonly description: string,
    public readonly icon: string,
    public readonly name: string,
    public readonly order: number,
    public readonly parent: T,
    public readonly required_auth: boolean,
    public readonly show: boolean,
    public readonly title: string,
    public readonly uri: string,
    public readonly id_parent?: string,
    public readonly id?: string,
  ) {}
}
