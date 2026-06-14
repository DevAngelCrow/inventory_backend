import { Country } from '../entities/country';
import { CountryId } from '../value-objects/country-value-object/country-id';

export abstract class CountryRepository {
  abstract create(country: Country): Promise<void>;
  abstract update(country: Country): Promise<void>;
  abstract toggleStatus(id: CountryId): Promise<Country>;
}
