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
import { HttpCursorPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-cursor-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import {
  GetGeographicDivisionsCursorQueryDto,
  GetGeographicDivisionsQueryDto,
} from '../dtos/query/get-geographic-divisions-query.dto';

import { CreateGeographicDivisionDto } from '../dtos/validators/geographic-division/create-geographic-division.dto';
import { UpdateGeographicDivisionDto } from '../dtos/validators/geographic-division/update-geographic-division.dto';
import { GeographicDivisionHttpDto } from '../dtos/http/geographic-division-http-dto/geographic-division-http.dto';
import { CreateGeographicDivisionCommand } from '../../application/geographic-division/commands/create-geographic-division/create-geographic-division.command';
import { UpdateGeographicDivisionCommand } from '../../application/geographic-division/commands/update-geographic-division/update-geographic-division.command';
import { DeleteGeographicDivisionCommand } from '../../application/geographic-division/commands/delete-geographic-division/delete-geographic-division.command';
import { GetGeographicDivisionsQuery } from '../../application/geographic-division/queries/get-geographic-divisions/get-geographic-divisions.query';
import { GetGeographicDivisionQuery } from '../../application/geographic-division/queries/get-geographic-division/get-geographic-division.query';
import { GetGeographicDivisionsCursorQuery } from '../../application/geographic-division/queries/get-geographic-divisions-cursor/get-geographic-divisions-cursor.query';
import { GeographicDivisionDto } from '../../application/dtos/geographic-division.dto';

@Controller('geographic-divisions')
@ApiBearerAuth('JWT-auth')
export class GeographicDivisionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('crear-division-geografica')
  @Post()
  @HttpCode(201)
  async create(
    @Body() body: CreateGeographicDivisionDto,
  ): Promise<SuccessResponseDto<null>> {
    const dto = new GeographicDivisionDto(
      body.name,
      body.description,
      body.id_country,
      body.id_type,
      body.active,
      body.id_parent,
    );
    await this.commandBus.execute(new CreateGeographicDivisionCommand(dto));
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Geographic division created successfully',
    );
  }

  @Permissions('editar-division-geografica')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateGeographicDivisionDto,
  ): Promise<SuccessResponseDto<null>> {
    const dto = new GeographicDivisionDto(
      body.name,
      body.description,
      body.id_country,
      body.id_type,
      body.active,
      body.id_parent,
      id,
    );
    await this.commandBus.execute(new UpdateGeographicDivisionCommand(dto));
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Geographic division updated successfully',
    );
  }

  @Permissions('listar-divisiones-geograficas')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'id_country', required: false, type: String })
  @ApiQuery({ name: 'id_parent', required: false, type: String })
  @ApiQuery({ name: 'id_type', required: false, type: String })
  async getAll(
    @Query() query: GetGeographicDivisionsQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<GeographicDivisionHttpDto>>
  > {
    const appQuery = new GetGeographicDivisionsQuery(
      query,
      query.filter,
      query.active,
      query.id_country,
      query.id_parent,
      query.id_type,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((item: GeographicDivisionDto) =>
      GeographicDivisionHttpDto.fromDto({ ...item }),
    );
    const response = new HttpPaginatedResponseDto<GeographicDivisionHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<GeographicDivisionHttpDto>
    >(response, HttpStatus.OK, 'Geographic divisions retrieved successfully');
  }

  @Permissions('listar-divisiones-geograficas')
  @Get('cursor')
  @HttpCode(200)
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'id_country', required: false, type: String })
  @ApiQuery({ name: 'id_parent', required: false, type: String })
  @ApiQuery({ name: 'id_type', required: false, type: String })
  async getAllWithCursor(
    @Query() query: GetGeographicDivisionsCursorQueryDto,
  ): Promise<
    SuccessResponseDto<
      HttpCursorPaginatedResponseDto<GeographicDivisionHttpDto>
    >
  > {
    const result: {
      data: GeographicDivisionDto[];
      next_cursor: string | null;
    } = await this.queryBus.execute(
      new GetGeographicDivisionsCursorQuery(
        query.cursor,
        query.limit,
        query.filter,
        query.active,
        query.id_country,
        query.id_parent,
        query.id_type,
      ),
    );

    const itemsHttp = result.data.map((item: GeographicDivisionDto) =>
      GeographicDivisionHttpDto.fromDto({ ...item }),
    );
    const response =
      new HttpCursorPaginatedResponseDto<GeographicDivisionHttpDto>(
        itemsHttp,
        result.next_cursor,
      );
    return new SuccessResponseDto<
      HttpCursorPaginatedResponseDto<GeographicDivisionHttpDto>
    >(response, HttpStatus.OK, 'Geographic divisions retrieved successfully');
  }

  @Permissions('ver-division-geografica')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<GeographicDivisionHttpDto>> {
    const result: GeographicDivisionDto = await this.queryBus.execute(
      new GetGeographicDivisionQuery(id),
    );
    if (!result) throw new NotFoundException('GeographicDivision', id);
    return new SuccessResponseDto<GeographicDivisionHttpDto>(
      GeographicDivisionHttpDto.fromDto(result),
      HttpStatus.OK,
      'Geographic division retrieved successfully',
    );
  }

  @Permissions('eliminar-division-geografica')
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: String })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const result = await this.commandBus.execute(
      new DeleteGeographicDivisionCommand(id),
    );
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Geographic division status updated to ${result.active ? 'active' : 'inactive'}`,
    );
  }
}
