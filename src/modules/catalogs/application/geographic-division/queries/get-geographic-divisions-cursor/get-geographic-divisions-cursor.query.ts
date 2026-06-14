export class GetGeographicDivisionsCursorQuery {
  constructor(
    public readonly cursor: string | undefined,
    public readonly limit: number,
    public readonly filter?: string,
    public readonly active?: boolean,
    public readonly id_country?: string,
    public readonly id_parent?: string,
    public readonly id_type?: string,
  ) {}
}
