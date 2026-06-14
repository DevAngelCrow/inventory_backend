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
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetGeographicDivisionTypesQueryDto } from '../dtos/query/get-geographic-division-types-query.dto';

import { CreateGeographicDivisionTypeDto } from '../dtos/validators/geographic-division-type/create-geographic-division-type.dto';
import { UpdateGeographicDivisionTypeDto } from '../dtos/validators/geographic-division-type/update-geographic-division-type.dto';
import { GeographicDivisionTypeHttpDto } from '../dtos/http/geographic-division-type-http-dto/geographic-division-type-http.dto';
import { CreateGeographicDivisionTypeCommand } from '../../application/geographic-division-type/commands/create-geographic-division-type/create-geographic-division-type.command';
import { UpdateGeographicDivisionTypeCommand } from '../../application/geographic-division-type/commands/update-geographic-division-type/update-geographic-division-type.command';
import { DeleteGeographicDivisionTypeCommand } from '../../application/geographic-division-type/commands/delete-geographic-division-type/delete-geographic-division-type.command';
import { GetGeographicDivisionTypesQuery } from '../../application/geographic-division-type/queries/get-geographic-division-types/get-geographic-division-types.query';
import { GetGeographicDivisionTypeQuery } from '../../application/geographic-division-type/queries/get-geographic-division-type/get-geographic-division-type.query';
import { GeographicDivisionTypeDto } from '../../application/dtos/geographic-division-type.dto';

@Controller('geographic-division-types')
@ApiBearerAuth('JWT-auth')
export class GeographicDivisionTypeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('crear-tipo-division-geografica')
  @Post()
  @HttpCode(201)
  async create(
    @Body() body: CreateGeographicDivisionTypeDto,
  ): Promise<SuccessResponseDto<null>> {
    await this.commandBus.execute(
      new CreateGeographicDivisionTypeCommand(body),
    );
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Geographic division type created successfully',
    );
  }

  @Permissions('editar-tipo-division-geografica')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateGeographicDivisionTypeDto,
  ): Promise<SuccessResponseDto<null>> {
    await this.commandBus.execute(
      new UpdateGeographicDivisionTypeCommand({ id, ...body }),
    );
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Geographic division type updated successfully',
    );
  }

  @Permissions('listar-tipos-division-geografica')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'id_country', required: false, type: String })
  async getAll(
    @Query() query: GetGeographicDivisionTypesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<GeographicDivisionTypeHttpDto>>
  > {
    const appQuery = new GetGeographicDivisionTypesQuery(
      query,
      query.filter,
      query.active,
      query.id_country,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((item: GeographicDivisionTypeDto) =>
      GeographicDivisionTypeHttpDto.fromDto({ ...item }),
    );
    const response =
      new HttpPaginatedResponseDto<GeographicDivisionTypeHttpDto>(
        itemsHttp,
        totalItems,
        totalPages,
        query.page,
        query.per_page,
      );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<GeographicDivisionTypeHttpDto>
    >(
      response,
      HttpStatus.OK,
      'Geographic division types retrieved successfully',
    );
  }

  @Permissions('ver-tipo-division-geografica')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<GeographicDivisionTypeHttpDto>> {
    const result: GeographicDivisionTypeDto = await this.queryBus.execute(
      new GetGeographicDivisionTypeQuery(id),
    );
    if (!result) throw new NotFoundException('GeographicDivisionType', id);
    return new SuccessResponseDto<GeographicDivisionTypeHttpDto>(
      GeographicDivisionTypeHttpDto.fromDto(result),
      HttpStatus.OK,
      'Geographic division type retrieved successfully',
    );
  }

  @Permissions('eliminar-tipo-division-geografica')
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: String })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const result = await this.commandBus.execute(
      new DeleteGeographicDivisionTypeCommand(id),
    );
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Geographic division type status updated to ${result.active ? 'active' : 'inactive'}`,
    );
  }
}
