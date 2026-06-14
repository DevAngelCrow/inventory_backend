import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { DocumentTypeDto } from '../dtos/document-type.dto';

export abstract class DocumentTypeReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<DocumentTypeDto> | DocumentTypeDto[]>;
  abstract getOneById(id: string): Promise<DocumentTypeDto | null>;
}
