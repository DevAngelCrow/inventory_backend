export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly phone: string,
    public readonly email?: string,
    public readonly phone_secondary?: string,
    public readonly company_name?: string,
    public readonly tax_id?: string,
    public readonly address_line1?: string,
    public readonly address_line2?: string,
    public readonly city?: string,
    public readonly state?: string,
    public readonly zip_code?: string,
    public readonly notes?: string,
    public readonly id_user?: string,
  ) {}
}
