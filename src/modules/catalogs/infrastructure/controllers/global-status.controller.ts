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

import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetGlobalStatusesQueryDto } from '../dtos/query/get-global-statuses-query.dto';

import { GlobalStatusHttpDto } from '../dtos/http/global-status-http-dto/global-status-http.dto';
import { CreateGlobalStatusDto } from '../dtos/validators/global-status/create-global-status.dto';
import { UpdateGlobalStatusDto } from '../dtos/validators/global-status/update-global-status.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateGlobalStatusCommand } from '../../application/global-status/commands/create-global-status/create-global-status.command';
import { UpdateGlobalStatusCommand } from '../../application/global-status/commands/update-global-status/update-global-status.command';
import { DeleteGlobalStatusCommand } from '../../application/global-status/commands/delete-global-status/delete-global-status.command';
import { GetGlobalStatusesQuery } from '../../application/global-status/queries/get-global-statuses/get-global-statuses.query';
import { GetGlobalStatusQuery } from '../../application/global-status/queries/get-global-status/get-global-status.query';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
@Controller('global-statuses')
@ApiBearerAuth('JWT-auth')
export class GlobalStatusController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-estado-global')
  @Post()
  @HttpCode(201)
  async create(
    @Body() globalStatusCreateRequest: CreateGlobalStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateGlobalStatusCommand(globalStatusCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'GlobalStatus created successfully',
    );
  }
  @Permissions('editar-estado-global')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() globalStatusUpdateRequest: UpdateGlobalStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateGlobalStatusCommand({
      ...globalStatusUpdateRequest,
      id,
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'GlobalStatus updated successfully',
    );
  }
  @Permissions('listar-estados-globales')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  async getAll(
    @Query() query: GetGlobalStatusesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<GlobalStatusHttpDto>>
  > {
    const appQuery = new GetGlobalStatusesQuery(
      query,
      query.filter_name,
      query.status,
      query.id_category,
      query.code_category,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((g: GlobalStatusHttpDto) =>
      GlobalStatusHttpDto.fromDto(g),
    );
    const response = new HttpPaginatedResponseDto<GlobalStatusHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<GlobalStatusHttpDto>
    >(response, HttpStatus.OK, 'GlobalStatuses retrieved successfully');
  }
  @Permissions('ver-estado-global')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<GlobalStatusHttpDto>> {
    const query = new GetGlobalStatusQuery(id);
    const globalStatus: GlobalStatusHttpDto =
      await this.queryBus.execute(query);
    if (!globalStatus) {
      throw new NotFoundException('GlobalStatus', id.toString());
    }
    const globalStatusDtoHttp = GlobalStatusHttpDto.fromDto(globalStatus);
    return new SuccessResponseDto<GlobalStatusHttpDto>(
      globalStatusDtoHttp,
      HttpStatus.OK,
      'GlobalStatus retrieved successfully',
    );
  }
  @Permissions('eliminar-estado-global')
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteGlobalStatusCommand(id);
    const globalStatus = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `GlobalStatus status was successfully updated to ${globalStatus.active ? 'active' : 'inactive'}`,
    );
  }
}
