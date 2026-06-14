import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CountryRepository } from '@/modules/catalogs/domain/repositories/country-repository';
import { DeleteCountryCommand } from './delete-country.command';
import { CountryId } from '@/modules/catalogs/domain/value-objects/country-value-object/country-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { CountryQueriesRepository } from '../../../repositories/country-read.repository';
import { CountryDto } from '../../../dtos/country.dto';
import { CatalogCacheService } from '@/shared/infrastructure/cache/catalog-cache.service';
import { COUNTRIES_CACHE_KEYS } from '../../queries/get-countries/get-countries.handler';

@CommandHandler(DeleteCountryCommand)
export class DeleteCountryHandler implements ICommandHandler<DeleteCountryCommand> {
  constructor(
    private readonly repository: CountryRepository,
    private readonly readRepository: CountryQueriesRepository,
    private readonly cache: CatalogCacheService,
  ) {}
  async execute(command: DeleteCountryCommand): Promise<CountryDto> {
    const country = await this.readRepository.getOneById(command.id);
    if (!country) {
      throw new NotFoundException('Country', command.id.toString());
    }
    const countryId = country.id;
    if (!countryId) {
      throw new Error(`Country id is undefined`);
    }
    const countryEntity = await this.repository.toggleStatus(
      new CountryId(countryId),
    );
    await this.cache.invalidate(COUNTRIES_CACHE_KEYS.ALL);

    const countryDto = CountryDto.fromEntity(countryEntity);

    return countryDto;
  }
}
