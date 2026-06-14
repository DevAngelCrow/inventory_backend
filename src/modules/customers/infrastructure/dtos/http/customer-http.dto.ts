import { CustomerDto } from '@/modules/customers/application/dtos/customer.dto';

export class CustomerHttpDto {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly phone: string,
    public readonly email: string | undefined,
    public readonly phone_secondary: string | undefined,
    public readonly company_name: string | undefined,
    public readonly tax_id: string | undefined,
    public readonly address_line1: string | undefined,
    public readonly address_line2: string | undefined,
    public readonly city: string | undefined,
    public readonly state: string | undefined,
    public readonly zip_code: string | undefined,
    public readonly notes: string | undefined,
    public readonly active: boolean,
    public readonly id_user: string | undefined,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}

  public static fromDto(dto: CustomerDto): CustomerHttpDto {
    return new CustomerHttpDto(
      dto.id!,
      dto.first_name,
      dto.last_name,
      dto.phone,
      dto.email,
      dto.phone_secondary,
      dto.company_name,
      dto.tax_id,
      dto.address_line1,
      dto.address_line2,
      dto.city,
      dto.state,
      dto.zip_code,
      dto.notes,
      dto.active ?? true,
      dto.id_user,
      dto.created_at,
      dto.updated_at,
    );
  }
}
