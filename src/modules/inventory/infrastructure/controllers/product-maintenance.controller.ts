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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';

import { CreateMaintenanceDto } from '../dtos/validators/maintenance/create-maintenance.dto';
import { ResolveMaintenanceDto } from '../dtos/validators/maintenance/resolve-maintenance.dto';
import { UpdateMaintenanceDto } from '../dtos/validators/maintenance/update-maintenance.dto';
import { GetMaintenancesQueryDto } from '../dtos/query/get-maintenances-query.dto';
import { MaintenanceHttpDto } from '../dtos/http/maintenance-http.dto';

import { CreateMaintenanceCommand } from '../../application/maintenance/commands/create-maintenance/create-maintenance.command';
import { ResolveMaintenanceCommand } from '../../application/maintenance/commands/resolve-maintenance/resolve-maintenance.command';
import { UpdateMaintenanceCommand } from '../../application/maintenance/commands/update-maintenance/update-maintenance.command';
import { GetMaintenancesQuery } from '../../application/maintenance/queries/get-maintenances/get-maintenances.query';
import { GetMaintenanceQuery } from '../../application/maintenance/queries/get-maintenance/get-maintenance.query';
import { MaintenanceDto } from '../../application/dtos/maintenance.dto';

@ApiTags('Maintenance')
@Controller('maintenance')
@ApiBearerAuth('JWT-auth')
export class ProductMaintenanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('crear-mantenimiento-producto')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateMaintenanceDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateMaintenanceCommand(
      dto.id_product,
      dto.description,
      dto.quantity,
      new Date(dto.date_start),
      dto.date_end ? new Date(dto.date_end) : null,
      dto.cost !== undefined ? dto.cost : null,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Maintenance record created successfully',
    );
  }

  @Permissions('editar-mantenimiento-producto')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMaintenanceDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateMaintenanceCommand(
      id,
      dto.description,
      dto.quantity,
      new Date(dto.date_start),
      dto.id_product,
      dto.cost !== undefined ? dto.cost : null,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Maintenance updated successfully',
    );
  }

  @Permissions('resolver-mantenimiento-producto')
  @Patch(':id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResolveMaintenanceDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new ResolveMaintenanceCommand(
      id,
      new Date(dto.date_end),
      dto.cost !== undefined ? dto.cost : null,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Maintenance resolved successfully',
    );
  }

  @Permissions('listar-mantenimientos-producto')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'id_product', required: false, type: String })
  @ApiQuery({ name: 'resolved', required: false, type: Boolean })
  async getAll(
    @Query() query: GetMaintenancesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<MaintenanceHttpDto>>> {
    const appQuery = new GetMaintenancesQuery(
      query,
      query.id_product,
      query.resolved,
    );
    const result = await this.queryBus.execute<
      GetMaintenancesQuery,
      Pagination<MaintenanceDto> | MaintenanceDto[]
    >(appQuery);

    const items =
      result instanceof Pagination ? result.getEntityList() : result;
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: MaintenanceDto) =>
      MaintenanceHttpDto.fromDto(c),
    );
    const response = new HttpPaginatedResponseDto<MaintenanceHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Maintenance records retrieved successfully',
    );
  }

  @Permissions('ver-mantenimiento-producto')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<MaintenanceHttpDto>> {
    const query = new GetMaintenanceQuery(id);
    const result: MaintenanceDto | null = await this.queryBus.execute(query);
    if (!result) {
      throw new NotFoundException('Maintenance', id);
    }
    return new SuccessResponseDto(
      MaintenanceHttpDto.fromDto(result),
      HttpStatus.OK,
      'Maintenance retrieved successfully',
    );
  }
}
