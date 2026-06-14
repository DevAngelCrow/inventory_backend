import { Rol } from '../entities/rol';
import { RolId } from '../value-objects/rol-value-object/rol-id';

export abstract class RolRepository {
  abstract create(rol: Rol): Promise<void>;
  abstract update(rol: Rol): Promise<void>;
  abstract toggleStatus(id: RolId): Promise<Rol>;
}
