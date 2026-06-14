import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CountryRepository } from '@/modules/catalogs/domain/repositories/country-repository';
import { CreateCountryCommand } from './create-country.command';
import { Country } from '@/modules/catalogs/domain/entities/country';
import { CatalogCacheService } from '@/shared/infrastructure/cache/catalog-cache.service';
import { COUNTRIES_CACHE_KEYS } from '../../queries/get-countries/get-countries.handler';

@CommandHandler(CreateCountryCommand)
export class CreateCountryHandler implements ICommandHandler<CreateCountryCommand> {
  constructor(
    private readonly repository: CountryRepository,
    private readonly cache: CatalogCacheService,
  ) {}

  async execute(command: CreateCountryCommand): Promise<void> {
    const country = Country.create({ ...command.country_dto });
    await this.repository.create(country);
    await this.cache.invalidate(COUNTRIES_CACHE_KEYS.ALL);
  }
}
