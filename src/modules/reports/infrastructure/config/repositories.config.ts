import { Provider } from '@nestjs/common';
import { REPORTS_READ_REPOSITORY } from '../../application/repositories/reports-read.repository';
import { ImplReportsReadRepository } from '../implementation/reports/impl-reports-read.repository';

export const reportsRepositoryProviders: Provider[] = [
  {
    provide: REPORTS_READ_REPOSITORY,
    useClass: ImplReportsReadRepository,
  },
];
