import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetDocumentTypesQuery } from './get-document-types.query';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { DocumentTypeReadRepository } from '../../../repositories/document-type-read.repository';
import { DocumentTypeDto } from '../../../dtos/document-type.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetDocumentTypesQuery)
export class GetDocumentTypesHandler implements IQueryHandler<GetDocumentTypesQuery> {
  constructor(private readonly repository: DocumentTypeReadRepository) {}
  async execute(
    query: GetDocumentTypesQuery,
  ): Promise<Pagination<DocumentTypeDto> | DocumentTypeDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter,
        query.active,
      );
    }
    return await this.repository.getAll(undefined, query.filter, query.active);
  }
}
