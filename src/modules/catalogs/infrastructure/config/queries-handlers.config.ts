import { GetCountriesHandler } from '../../application/country/queries/get-countries/get-countries.handler';
import { GetCountryHandler } from '../../application/country/queries/get-country/get-country.handler';
import { GetGlobalStatusesHandler } from '../../application/global-status/queries/get-global-statuses/get-global-statuses.handler';
import { GetGlobalStatusHandler } from '../../application/global-status/queries/get-global-status/get-global-status.handler';
import { GetGlobalStatusByCodeHandler } from '../../application/global-status/queries/get-global-status-by-code/get-global-status-by-code.handler';
import { GetMaritalStatusesHandler } from '../../application/marital-status/queries/get-marital-statuses/get-marital-statuses.handler';
import { GetMaritalStatusHandler } from '../../application/marital-status/queries/get-marital-status/get-marital-status.handler';
import { GetGendersHandler } from '../../application/gender/queries/get-genders/get-genders.handler';
import { GetCategoriesStatusHandler } from '../../application/category-status/queries/get-categories-status/get-categories-status.handler';
import { GetCategoryStatusHandler } from '../../application/category-status/queries/get-category-status/get-category-status.handler';
import { GetGeographicDivisionTypesHandler } from '../../application/geographic-division-type/queries/get-geographic-division-types/get-geographic-division-types.handler';
import { GetGeographicDivisionTypeHandler } from '../../application/geographic-division-type/queries/get-geographic-division-type/get-geographic-division-type.handler';
import { GetGeographicDivisionsHandler } from '../../application/geographic-division/queries/get-geographic-divisions/get-geographic-divisions.handler';
import { GetGeographicDivisionHandler } from '../../application/geographic-division/queries/get-geographic-division/get-geographic-division.handler';
import { GetGeographicDivisionsCursorHandler } from '../../application/geographic-division/queries/get-geographic-divisions-cursor/get-geographic-divisions-cursor.handler';
import { GetGeographicDivisionLineageHandler } from '../../application/geographic-division/queries/get-geographic-division-lineage/get-geographic-division-lineage.handler';

export const queryHandlerProviders = [
  GetCountriesHandler,
  GetCountryHandler,
  GetGlobalStatusesHandler,
  GetGlobalStatusHandler,
  GetGlobalStatusByCodeHandler,
  GetMaritalStatusesHandler,
  GetMaritalStatusHandler,
  GetGendersHandler,
  GetCategoriesStatusHandler,
  GetCategoryStatusHandler,
  GetGeographicDivisionTypesHandler,
  GetGeographicDivisionTypeHandler,
  GetGeographicDivisionsHandler,
  GetGeographicDivisionHandler,
  GetGeographicDivisionsCursorHandler,
  GetGeographicDivisionLineageHandler,
];
