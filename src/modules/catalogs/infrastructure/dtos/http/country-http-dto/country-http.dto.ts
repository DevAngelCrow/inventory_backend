import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { Country } from 'src/modules/catalogs/domain/entities/country';

export class CountryHttpDto {
  constructor(
    public readonly name: string,
    public readonly iso2: string,
    public readonly abbreviation: string,
    public readonly code: string,
    public readonly phone_code: string,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(country: Country): CountryHttpDto {
    return new CountryHttpDto(
      country.getName().value(),
      country.getIso2().value(),
      country.getAbbreviation().value(),
      country.getCode().value(),
      country.getPhoneCode().value(),
      country.getActive().value(),
      country.getId() ? country.getId()?.value() : undefined,
    );
  }
  public static fromDto(dto: CountryHttpDto): CountryHttpDto {
    return new CountryHttpDto(
      dto.name,
      dto.iso2,
      dto.abbreviation,
      dto.code,
      dto.phone_code,
      dto.active,
      dto.id,
      dto.status,
    );
  }
}
