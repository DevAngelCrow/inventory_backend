import { GeographicDivisionType } from '../entities/geographic-division-type';
import { GeographicDivisionTypeId } from '../value-objects/geographic-division-type-value-object/geographic-division-type-id';

export abstract class GeographicDivisionTypeRepository {
  abstract create(entity: GeographicDivisionType): Promise<void>;
  abstract update(entity: GeographicDivisionType): Promise<void>;
  abstract toggleStatus(
    id: GeographicDivisionTypeId,
  ): Promise<GeographicDivisionType>;
}
