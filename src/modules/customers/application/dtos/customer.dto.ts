import { CustomerAddressDto } from './customer-address.dto';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export class CustomerDto {
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
    public readonly active?: boolean,
    public readonly country_name?: string,
    public readonly country_phone_code?: string,
    public readonly addresses?: CustomerAddressDto[],
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly status?: GlobalStatusDto,
  ) {}
}
