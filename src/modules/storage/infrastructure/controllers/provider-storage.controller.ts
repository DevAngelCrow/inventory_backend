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
} from '@nestjs/common';
import { CreateProviderStorageDto } from '../dtos/validators/provider-storage/create-provider-storage.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { UpdateProviderStorageDto } from '../dtos/validators/provider-storage/update-provider-storage.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { ProviderStorageHttpDto } from '../dtos/http/provider-storage-http-dto/provider-storage-http.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetProviderStoragesQueryDto } from '../dtos/query/get-provider-storages-query.dto';
import { ProviderStorage } from '../../domain/entities/provider-storage';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProviderStorageCommand } from '../../application/provider-storage/commands/create-provider-storage/create-provider-storage.command';
import { UpdateProviderStorageCommand } from '../../application/provider-storage/commands/update-provider-storage/update-provider-storage.command';
import { DeleteProviderStorageCommand } from '../../application/provider-storage/commands/delete-provider-storage/delete-provider-storage.command';
import { GetProviderStoragesQuery } from '../../application/provider-storage/queries/get-provider-storages/get-provider-storages.query';
import { GetProviderStorageQuery } from '../../application/provider-storage/queries/get-provider-storage/get-provider-storage.query';
import { GetProviderStorageByCodeQuery } from '../../application/provider-storage/queries/get-provider-storage-by-code/get-provider-storage-by-code.query';
import { ProviderStorageDto } from '../../application/dtos/provider-storage.dto';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';

@Controller('provider-storages')
@ApiBearerAuth('JWT-auth')
export class ProviderStorageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-proveedor-almacenamiento')
  @Post()
  @HttpCode(201)
  async create(
    @Body() providerStorageCreateRequest: CreateProviderStorageDto,
  ): Promise<SuccessResponseDto<null>> {
    const providerStorageDto = new ProviderStorageDto(
      providerStorageCreateRequest.name,
      providerStorageCreateRequest.code,
      providerStorageCreateRequest.description,
      providerStorageCreateRequest.active,
    );
    const command = new CreateProviderStorageCommand(providerStorageDto);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'ProviderStorage created successfully',
    );
  }
  @Permissions('editar-proveedor-almacenamiento')
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() providerStorageUpdateRequest: UpdateProviderStorageDto,
  ): Promise<SuccessResponseDto<null>> {
    const providerStorageDto = new ProviderStorageDto(
      providerStorageUpdateRequest.name,
      providerStorageUpdateRequest.code,
      providerStorageUpdateRequest.description,
      providerStorageUpdateRequest.active,
      id,
    );
    const command = new UpdateProviderStorageCommand(providerStorageDto);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'ProviderStorage updated successfully',
    );
  }
  @Permissions('listar-proveedores-almacenamientos')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetProviderStoragesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<ProviderStorageHttpDto>>
  > {
    const appQuery = new GetProviderStoragesQuery(query, query.filter);
    const result = await this.queryBus.execute<
      GetProviderStoragesQuery,
      Pagination<ProviderStorage>
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((p) => ProviderStorageHttpDto.fromEntity(p));
    const response = new HttpPaginatedResponseDto<ProviderStorageHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<ProviderStorageHttpDto>
    >(response, HttpStatus.OK, 'ProviderStorages retrieved successfully');
  }
  @Permissions('ver-proveedor-almacenamiento')
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<ProviderStorageHttpDto>> {
    const query = new GetProviderStorageQuery(id);
    const providerStorage = await this.queryBus.execute<
      GetProviderStorageQuery,
      ProviderStorage
    >(query);

    const providerStorageDtoHttp =
      ProviderStorageHttpDto.fromEntity(providerStorage);
    return new SuccessResponseDto<ProviderStorageHttpDto>(
      providerStorageDtoHttp,
      HttpStatus.OK,
      'ProviderStorage retrieved successfully',
    );
  }
  @Permissions('ver-proveedor-almacenamiento')
  @Get('code/:code')
  @HttpCode(200)
  async getOneByCode(
    @Param('code') code: string,
  ): Promise<SuccessResponseDto<ProviderStorageHttpDto>> {
    const query = new GetProviderStorageByCodeQuery(code);
    const providerStorage = await this.queryBus.execute<
      GetProviderStorageByCodeQuery,
      ProviderStorage
    >(query);

    const providerStorageDtoHttp =
      ProviderStorageHttpDto.fromEntity(providerStorage);
    return new SuccessResponseDto<ProviderStorageHttpDto>(
      providerStorageDtoHttp,
      HttpStatus.OK,
      'ProviderStorage retrieved successfully',
    );
  }
  @Permissions('eliminar-proveedor-almacenamiento')
  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteProviderStorageCommand(id);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'ProviderStorage deleted successfully',
    );
  }
}
