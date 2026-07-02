export class CustomerAddressDto {
  constructor(
    public readonly label: string,
    public readonly address_line1: string,
    public readonly is_primary: boolean,
    public readonly address_line2?: string,
    public readonly zip_code?: string,
    public readonly id_geographic_division?: string,
    public readonly id?: string,
    public readonly active?: boolean,
    public readonly geographic_division_name?: string,
    public readonly state_name?: string,
  ) {}
}
