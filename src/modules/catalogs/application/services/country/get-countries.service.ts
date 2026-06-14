import { Pagination } from '@/shared/domain/value-object/pagination';
import { CountryDto } from '../../dtos/country.dto';
import { GetCountriesHandler } from '../../country/queries/get-countries/get-countries.handler';
import { GetCountriesQuery } from '../../country/queries/get-countries/get-countries.query';

export class GetCountriesService {
  constructor(private readonly getCountriesHandler: GetCountriesHandler) {}

  async run(
    query: GetCountriesQuery,
  ): Promise<Pagination<CountryDto> | CountryDto[]> {
    return await this.getCountriesHandler.execute(query);
  }
}
