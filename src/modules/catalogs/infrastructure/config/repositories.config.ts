import { CountryQueriesRepository } from '../../application/repositories/country-read.repository';
import { GlobalStatusQueriesRepository } from '../../application/repositories/global-status-read.repository';
import { MaritalStatusQueriesRepository } from '../../application/repositories/marital-status-read.repository';
import { CountryRepository } from '../../domain/repositories/country-repository';
import { GlobalStatsusRepository } from '../../domain/repositories/global-status-repository';
import { MaritalStatusRepository } from '../../domain/repositories/marital-status-repository';
import { ImplCountryRepository } from '../implementation/country/impl-country.repository';
import { ImplGlobalStatusRepository } from '../implementation/global-status/impl-global-status.repository';
import { ImplMaritalStatusRepository } from '../implementation/marital-status/impl-marital-status.repository';
import { GenderQueriesRepository } from '../../application/repositories/gender-read.repository';
import { ImplGenderRepository } from '../implementation/gender/impl-gender.repository';
import { CategoryStatusRepository } from '../../domain/repositories/category-status-repository';
import { CategoryStatusQueriesRepository } from '../../application/repositories/category-status-read.repository';
import { ImplCategoryStatusRepository } from '../implementation/category-status/impl-category-status.repository';
import { GeographicDivisionTypeRepository } from '../../domain/repositories/geographic-division-type-repository';
import { GeographicDivisionTypeQueriesRepository } from '../../application/repositories/geographic-division-type-read.repository';
import { ImplGeographicDivisionTypeRepository } from '../implementation/geographic-division-type/impl-geographic-division-type.repository';
import { GeographicDivisionRepository } from '../../domain/repositories/geographic-division-repository';
import { GeographicDivisionQueriesRepository } from '../../application/repositories/geographic-division-read.repository';
import { ImplGeographicDivisionRepository } from '../implementation/geographic-division/impl-geographic-division.repository';

export const repositories = [
  { provide: CountryRepository, useClass: ImplCountryRepository },
  { provide: CountryQueriesRepository, useClass: ImplCountryRepository },
  { provide: GlobalStatsusRepository, useClass: ImplGlobalStatusRepository },
  {
    provide: GlobalStatusQueriesRepository,
    useClass: ImplGlobalStatusRepository,
  },
  { provide: MaritalStatusRepository, useClass: ImplMaritalStatusRepository },
  {
    provide: MaritalStatusQueriesRepository,
    useClass: ImplMaritalStatusRepository,
  },
  {
    provide: GenderQueriesRepository,
    useClass: ImplGenderRepository,
  },
  { provide: CategoryStatusRepository, useClass: ImplCategoryStatusRepository },
  {
    provide: CategoryStatusQueriesRepository,
    useClass: ImplCategoryStatusRepository,
  },
  {
    provide: GeographicDivisionTypeRepository,
    useClass: ImplGeographicDivisionTypeRepository,
  },
  {
    provide: GeographicDivisionTypeQueriesRepository,
    useClass: ImplGeographicDivisionTypeRepository,
  },
  {
    provide: GeographicDivisionRepository,
    useClass: ImplGeographicDivisionRepository,
  },
  {
    provide: GeographicDivisionQueriesRepository,
    useClass: ImplGeographicDivisionRepository,
  },
];
