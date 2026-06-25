import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { InspectionDto } from '../dtos/inspection.dto';

export abstract class InspectionQueriesRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter_reservation?: string,
    filter_status?: string,
  ): Promise<Pagination<InspectionDto> | InspectionDto[]>;
  abstract findById(id: string): Promise<InspectionDto | null>;
}
