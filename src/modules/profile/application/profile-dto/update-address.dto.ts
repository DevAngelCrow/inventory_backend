export class UpdateAddressDto {
  constructor(
    public readonly id?: string,
    public readonly id_people?: string,
    public readonly street?: string,
    public readonly street_number?: string,
    public readonly neighborhood?: string,
    public readonly id_geographic_division?: string,
    public readonly house_number?: string,
    public readonly block?: string,
    public readonly pathway?: string,
    public readonly current?: boolean,
  ) {}
}
