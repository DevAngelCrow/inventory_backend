import { CountryDto } from '@/modules/catalogs/application/dtos/country.dto';
import { GeographicDivisionDto } from '@/modules/catalogs/application/dtos/geographic-division.dto';
import { GenderDto } from '@/modules/catalogs/application/dtos/gender.dto';
import { DocumentTypeDto } from '@/modules/profile/application/dtos/document-type.dto';

export class CatalogsHttpDto {
  constructor(
    public readonly countries: CountryDto[],
    public readonly geographic_divisions: GeographicDivisionDto[],
    public readonly genders: GenderDto[],
    public readonly documentTypes: DocumentTypeDto[],
  ) {}
}
