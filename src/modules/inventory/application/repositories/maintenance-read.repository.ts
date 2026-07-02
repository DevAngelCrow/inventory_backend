import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { MaintenanceDto } from '../dtos/maintenance.dto';

export abstract class MaintenanceQueriesRepository {
  abstract getAll(
    params: PaginationParamsDto,
    id_product?: string,
    resolved?: boolean,
  ): Promise<Pagination<MaintenanceDto> | MaintenanceDto[]>;
  abstract getById(id: string): Promise<MaintenanceDto | null>;
}
