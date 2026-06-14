import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentDto } from '../dtos/validators/document/document.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';

import { DocumentHttpDto } from '../dtos/http/document-http-dto/document-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetDocumentsQueryDto } from '../dtos/query/get-documents-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDocumentCommand } from '../../application/document/commands/create-document/create-document.command';
import { UpdateDocumentCommand } from '../../application/document/commands/update-document/update-document.command';
import { GetDocumentsQuery } from '../../application/document/queries/get-documents/get-documents.query';
import { GetDocumentByIdQuery } from '../../application/document/queries/get-document-by-id/get-document-by-id.query';
import { DeleteDocumentCommand } from '../../application/document/commands/delete-document/delete-document.command';
import {
  OwnsResource,
  OwnsResourceGuard,
} from '@/shared/infrastructure/http/guards/owns-resource.guard';
import { Document } from '../../domain/entities/document';

// Bypass permission for the IDOR guard — see address.controller.ts for the
// same pattern. Add to seeds and grant to admin roles.
const BYPASS_DOCUMENT_OWNERSHIP = ['gestionar-cualquier-documento'];

@Controller('documents')
@ApiBearerAuth('JWT-auth')
export class DocumentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-documento')
  @Post()
  @HttpCode(201)
  async create(
    @Body() documentCreateRequest: DocumentDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateDocumentCommand(documentCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Document created successfully',
    );
  }
  @Permissions('editar-documento')
  @UseGuards(OwnsResourceGuard)
  @OwnsResource<Document>({
    paramKey: 'id',
    query: GetDocumentByIdQuery,
    getOwnerId: (d) => d.getIdPeople().value(),
    authField: 'id_people',
    bypassWithPermissions: BYPASS_DOCUMENT_OWNERSHIP,
  })
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() documentUpdateRequest: DocumentDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateDocumentCommand({ ...documentUpdateRequest, id });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Document updated successfully',
    );
  }
  @Permissions('listar-documentos')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetDocumentsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<DocumentHttpDto>>> {
    const appQuery = new GetDocumentsQuery(query, query.filter);
    const result = await this.queryBus.execute<
      GetDocumentsQuery,
      Pagination<Document>
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((d) => DocumentHttpDto.fromEntity(d));
    const response = new HttpPaginatedResponseDto<DocumentHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<DocumentHttpDto>>(
      response,
      HttpStatus.OK,
      'Documents retrieved successfully',
    );
  }
  @Permissions('ver-documento')
  @UseGuards(OwnsResourceGuard)
  @OwnsResource<Document>({
    paramKey: 'id',
    query: GetDocumentByIdQuery,
    getOwnerId: (d) => d.getIdPeople().value(),
    authField: 'id_people',
    bypassWithPermissions: BYPASS_DOCUMENT_OWNERSHIP,
  })
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<DocumentHttpDto>> {
    const query = new GetDocumentByIdQuery(id);
    const document = await this.queryBus.execute<
      GetDocumentByIdQuery,
      Document | null
    >(query);
    if (!document) {
      throw new NotFoundException('Document', id.toString());
    }
    const documentDtoHttp = DocumentHttpDto.fromEntity(document);
    return new SuccessResponseDto<DocumentHttpDto>(
      documentDtoHttp,
      HttpStatus.OK,
      'Document retrieved successfully',
    );
  }
  @Permissions('eliminar-documento')
  @UseGuards(OwnsResourceGuard)
  @OwnsResource<Document>({
    paramKey: 'id',
    query: GetDocumentByIdQuery,
    getOwnerId: (d) => d.getIdPeople().value(),
    authField: 'id_people',
    bypassWithPermissions: BYPASS_DOCUMENT_OWNERSHIP,
  })
  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteDocumentCommand(id);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Document deleted successfully',
    );
  }
}
