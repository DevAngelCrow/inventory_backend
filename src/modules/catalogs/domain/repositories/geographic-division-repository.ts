import { GeographicDivision } from '../entities/geographic-division';
import { GeographicDivisionId } from '../value-objects/geographic-division-value-object/geographic-division-id';

export abstract class GeographicDivisionRepository {
  abstract create(entity: GeographicDivision): Promise<void>;
  abstract update(entity: GeographicDivision): Promise<void>;
  abstract toggleStatus(id: GeographicDivisionId): Promise<GeographicDivision>;
}
