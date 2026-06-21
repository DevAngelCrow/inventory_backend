import { CustomerAddressDto } from '@/modules/customers/application/dtos/customer-address.dto';

export class CustomerAddressHttpDto {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly address_line1: string,
    public readonly address_line2: string | undefined,
    public readonly zip_code: string | undefined,
    public readonly is_primary: boolean,
    public readonly active: boolean,
    public readonly id_geographic_division: string | undefined,
    public readonly geographic_division_name: string | undefined,
    public readonly state_name: string | undefined,
  ) {}

  public static fromDto(dto: CustomerAddressDto): CustomerAddressHttpDto {
    return new CustomerAddressHttpDto(
      dto.id!,
      dto.label,
      dto.address_line1,
      dto.address_line2,
      dto.zip_code,
      dto.is_primary,
      dto.active ?? true,
      dto.id_geographic_division,
      dto.geographic_division_name,
      dto.state_name,
    );
  }
}
