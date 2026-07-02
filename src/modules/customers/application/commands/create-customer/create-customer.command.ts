export class CreateCustomerCommand {
  constructor(
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly phone: string,
    public readonly id_country: string,
    public readonly middle_name?: string,
    public readonly email?: string,
    public readonly phone_secondary?: string,
    public readonly company_name?: string,
    public readonly tax_id?: string,
    public readonly notes?: string,
    public readonly addresses?: {
      label: string;
      address_line1: string;
      address_line2?: string;
      zip_code?: string;
      is_primary?: boolean;
      id_geographic_division?: string;
    }[],
  ) {}
}
