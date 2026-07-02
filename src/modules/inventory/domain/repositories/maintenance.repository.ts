import { Maintenance } from '../entities/maintenance';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

export const MAINTENANCE_REPOSITORY = 'MAINTENANCE_REPOSITORY';

export interface MaintenanceRepository {
  save(maintenance: Maintenance): Promise<Maintenance>;
  findById(id: string): Promise<Maintenance | null>;
  findAll(
    params: PaginationParamsDto,
    id_product?: string,
    resolved?: boolean,
  ): Promise<Pagination<Maintenance> | Maintenance[]>;
}
