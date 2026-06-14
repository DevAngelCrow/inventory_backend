import { CountryDto } from '../../../dtos/country.dto';

export class CreateCountryCommand {
  constructor(public readonly country_dto: CountryDto) {}
}
