import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCountryQuery } from './get-country.query';
import { CountryId } from '@/modules/catalogs/domain/value-objects/country-value-object/country-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CountryQueriesRepository } from '../../../repositories/country-read.repository';
import { CountryDto } from '../../../dtos/country.dto';

@QueryHandler(GetCountryQuery)
export class GetCountryHandler implements IQueryHandler<GetCountryQuery> {
  constructor(private readonly repository: CountryQueriesRepository) {}

  async execute(query: GetCountryQuery): Promise<CountryDto | null> {
    const countryId = new CountryId(query.id_country);
    const country = await this.repository.getOneById(countryId.value());
    if (!country) {
      throw new NotFoundException('Country', query.id_country.toString());
    }
    return country;
  }
}
