import { CustomerDto } from '@/modules/customers/application/dtos/customer.dto';
import { CustomerAddressHttpDto } from './customer-address-http.dto';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export class CustomerHttpDto {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly middle_name: string | undefined,
    public readonly last_name: string,
    public readonly phone: string,
    public readonly email: string | undefined,
    public readonly phone_secondary: string | undefined,
    public readonly company_name: string | undefined,
    public readonly tax_id: string | undefined,
    public readonly notes: string | undefined,
    public readonly active: boolean,
    public readonly id_country: string,
    public readonly country_name: string | undefined,
    public readonly country_phone_code: string | undefined,
    public readonly addresses: CustomerAddressHttpDto[],
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly status?: GlobalStatusDto,
  ) {}

  public static fromDto(dto: CustomerDto): CustomerHttpDto {
    return new CustomerHttpDto(
      dto.id!,
      dto.first_name,
      dto.middle_name,
      dto.last_name,
      dto.phone,
      dto.email,
      dto.phone_secondary,
      dto.company_name,
      dto.tax_id,
      dto.notes,
      dto.active ?? true,
      dto.id_country,
      dto.country_name,
      dto.country_phone_code,
      dto.addresses ? dto.addresses.map(a => CustomerAddressHttpDto.fromDto(a)) : [],
      dto.created_at,
      dto.updated_at,
      dto.status,
    );
  }
}
