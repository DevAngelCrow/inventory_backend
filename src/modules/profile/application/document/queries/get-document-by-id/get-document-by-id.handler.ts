import { DocumentId } from '@/modules/profile/domain/value-objects/document-value-object/document-id';
import { GetDocumentByIdQuery } from './get-document-by-id.query';
import { DocumentReadRepository } from '../../../repositories/document-read.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetDocumentByIdQuery)
export class GetDocumentByIdHandler implements IQueryHandler<GetDocumentByIdQuery> {
  constructor(private readonly repository: DocumentReadRepository) {}

  async execute(query: GetDocumentByIdQuery) {
    return await this.repository.getOneById(new DocumentId(query.id));
  }
}
