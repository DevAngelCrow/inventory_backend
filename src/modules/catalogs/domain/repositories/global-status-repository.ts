import { GlobalStatus } from '../entities/global-status';
import { GlobalStatusId } from '../value-objects/goblal-status-value-object/global-status-id';
export abstract class GlobalStatsusRepository {
  abstract create(global_status: GlobalStatus): Promise<void>;
  abstract update(global_status: GlobalStatus): Promise<void>;
  abstract toggleStatus(id: GlobalStatusId): Promise<GlobalStatus>;
}
