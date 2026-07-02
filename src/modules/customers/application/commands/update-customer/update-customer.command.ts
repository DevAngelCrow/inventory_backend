export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
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
  ) {}
}
