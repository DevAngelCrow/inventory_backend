export class GetGlobalStatusByCodeQuery {
  constructor(
    public readonly code: string,
    public readonly category_name: string,
  ) {}
}
