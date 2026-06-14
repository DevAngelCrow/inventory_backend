import { InspectionRepository } from '../../domain/repositories/inspection-repository';
import { InspectionQueriesRepository } from '../../application/repositories/inspection-read.repository';
import { ImplInspectionRepository } from '../implementation/inspection/impl-inspection.repository';

export const inspectionRepositories = [
  { provide: InspectionRepository, useClass: ImplInspectionRepository },
  { provide: InspectionQueriesRepository, useClass: ImplInspectionRepository },
];
