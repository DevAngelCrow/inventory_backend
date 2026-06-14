import { Abstract, Type } from '@nestjs/common';
import { GetGlobalStatusByCodeService } from '../../application/services/global-status/get-global-status-by-code.service';
import { GetGlobalStatusByCodeHandler } from '../../application/global-status/queries/get-global-status-by-code/get-global-status-by-code.handler';
import { GetMaritalStatusesService } from '../../application/services/marital-status/get-marital-statuses.service';
import { GetMaritalStatusesHandler } from '../../application/marital-status/queries/get-marital-statuses/get-marital-statuses.handler';
import { GetGeographicDivisionsService } from '../../application/services/geographic-division/get-geographic-divisions.service';
import { GetGeographicDivisionsHandler } from '../../application/geographic-division/queries/get-geographic-divisions/get-geographic-divisions.handler';
import { GetGendersService } from '../../application/services/gender/get-genders.service';
import { GetGendersHandler } from '../../application/gender/queries/get-genders/get-genders.handler';
import { GetCountriesService } from '../../application/services/country/get-countries.service';
import { GetCountriesHandler } from '../../application/country/queries/get-countries/get-countries.handler';
import { registerService } from '@/shared/infrastructure/factories/register-service.factory';

export const services: Array<{
  service: Type<unknown>;
  deps: Array<Type<unknown> | Abstract<unknown>>;
}> = [
  {
    service: GetGlobalStatusByCodeService,
    deps: [GetGlobalStatusByCodeHandler],
  },
  {
    service: GetMaritalStatusesService,
    deps: [GetMaritalStatusesHandler],
  },
  {
    service: GetGeographicDivisionsService,
    deps: [GetGeographicDivisionsHandler],
  },
  {
    service: GetGendersService,
    deps: [GetGendersHandler],
  },
  {
    service: GetCountriesService,
    deps: [GetCountriesHandler],
  },
];

export const serviceProviders = services.map((uc) => {
  return registerService(uc.service, uc.deps);
});
