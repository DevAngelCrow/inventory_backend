import { CountryDto } from '../../../dtos/country.dto';

export class UpdateCountryCommand {
  constructor(public readonly country_dto: CountryDto) {}
}
