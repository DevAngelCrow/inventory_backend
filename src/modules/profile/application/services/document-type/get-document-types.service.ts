import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetDocumentTypesHandler } from '../../document-type/queries/get-document-types/get-document-types.handler';
import { GetDocumentTypesQuery } from '../../document-type/queries/get-document-types/get-document-types.query';
import { DocumentTypeDto } from '../../dtos/document-type.dto';

export class GetDocumentTypesService {
  constructor(
    private readonly getDocumentTypesHandler: GetDocumentTypesHandler,
  ) {}

  async run(
    query: GetDocumentTypesQuery,
  ): Promise<Pagination<DocumentTypeDto> | DocumentTypeDto[]> {
    return await this.getDocumentTypesHandler.execute(query);
  }
}
