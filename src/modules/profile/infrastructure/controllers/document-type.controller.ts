import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DocumentTypeDto } from '../dtos/validators/document-type/document-type.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { DocumentTypeHttpDto } from '../dtos/http/document-type-http-dto/document-type-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetDocumentTypesQueryDto } from '../dtos/query/get-document-types-query.dto';

import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDocumentTypeCommand } from '../../application/document-type/commands/create-document-type/create-document-type.command';
import { UpdateDocumentTypeCommand } from '../../application/document-type/commands/update-document-type/update-document-type.command';
import { DeleteDocumentTypeCommand } from '../../application/document-type/commands/delete-document-type/delete-document-type.command';
import { GetDocumentTypesQuery } from '../../application/document-type/queries/get-document-types/get-document-types.query';
import { GetDocumentTypeByIdQuery } from '../../application/document-type/queries/get-document-type-by-id/get-document-type-by-id.query';

import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
@Controller('document-types')
@ApiBearerAuth('JWT-auth')
export class DocumentTypeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-tipo-documento')
  @Post()
  @HttpCode(201)
  async create(
    @Body() documentTypeCreateRequest: DocumentTypeDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateDocumentTypeCommand(documentTypeCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'DocumentType created successfully',
    );
  }
  @Permissions('editar-tipo-documento')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() documentTypeUpdateRequest: DocumentTypeDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateDocumentTypeCommand({
      ...documentTypeUpdateRequest,
      id,
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'DocumentType updated successfully',
    );
  }
  @Permissions('listar-tipos-documentos', 'ver-mi-perfil')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  async getAll(
    @Query() query: GetDocumentTypesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<DocumentTypeHttpDto>>
  > {
    const appQuery = new GetDocumentTypesQuery(
      query,
      query.filter_name,
      query.status,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((d: DocumentTypeHttpDto) =>
      DocumentTypeHttpDto.fromDto(d),
    );
    const response = new HttpPaginatedResponseDto<DocumentTypeHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<DocumentTypeHttpDto>
    >(response, HttpStatus.OK, 'DocumentTypes retrieved successfully');
  }
  @Permissions('ver-tipo-documento')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<DocumentTypeHttpDto>> {
    const query = new GetDocumentTypeByIdQuery(id);
    const documentType: DocumentTypeHttpDto | null =
      await this.queryBus.execute(query);
    if (!documentType) {
      throw new NotFoundException('DocumentType', id.toString());
    }
    const documentTypeDtoHttp = DocumentTypeHttpDto.fromDto(documentType);
    return new SuccessResponseDto<DocumentTypeHttpDto>(
      documentTypeDtoHttp,
      HttpStatus.OK,
      'DocumentType retrieved successfully',
    );
  }
  @Permissions('eliminar-tipo-documento')
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteDocumentTypeCommand(id);
    const documentType = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `DocumentType status was successfully updated to ${documentType.active ? 'active' : 'inactive'}`,
    );
  }
}
