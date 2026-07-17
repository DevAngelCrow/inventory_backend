import { MeasurementUnit } from '../entities/measurement-unit';
import { MeasurementUnitId } from '../value-objects/measurement-unit-value-object/measurement-unit-id';

export abstract class MeasurementUnitRepository {
  abstract save(measurementUnit: MeasurementUnit): Promise<void>;
  abstract findById(id: MeasurementUnitId): Promise<MeasurementUnit | null>;
  abstract delete(id: MeasurementUnitId): Promise<void>;
}
