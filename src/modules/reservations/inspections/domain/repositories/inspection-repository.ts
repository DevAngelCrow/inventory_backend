import { Inspection } from '../entities/inspection';

export abstract class InspectionRepository {
  abstract save(inspection: Inspection): Promise<void>;
}
