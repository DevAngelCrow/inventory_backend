import { MaritalStatus } from '../entities/marital-status';
import { MaritalStatusId } from '../value-objects/marital-status-value-object/marital-status-id';

export abstract class MaritalStatusRepository {
  abstract create(marital_status: MaritalStatus): Promise<void>;
  abstract update(marital_status: MaritalStatus): Promise<void>;
  abstract delete(id: MaritalStatusId): Promise<void>;
}
