import { GetDocumentTypeByIdQuery } from './get-document-type-by-id.query';
import { DocumentTypeReadRepository } from '../../../repositories/document-type-read.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetDocumentTypeByIdQuery)
export class GetDocumentTypeByIdHandler implements IQueryHandler<GetDocumentTypeByIdQuery> {
  constructor(private readonly repository: DocumentTypeReadRepository) {}
  async execute(query: GetDocumentTypeByIdQuery) {
    return await this.repository.getOneById(query.id);
  }
}
