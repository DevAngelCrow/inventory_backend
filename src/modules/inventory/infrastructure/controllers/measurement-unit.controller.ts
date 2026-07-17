import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';
import { GetAllMeasurementUnitsQuery } from '../../application/queries/measurement-unit/get-all-measurement-units/get-all-measurement-units.query';
import { GetActiveMeasurementUnitsQuery } from '../../application/queries/measurement-unit/get-active-measurement-units/get-active-measurement-units.query';
import { CreateMeasurementUnitCommand } from '../../application/commands/measurement-unit/create-measurement-unit/create-measurement-unit.command';
import { UpdateMeasurementUnitCommand } from '../../application/commands/measurement-unit/update-measurement-unit/update-measurement-unit.command';
import { DeleteMeasurementUnitCommand } from '../../application/commands/measurement-unit/delete-measurement-unit/delete-measurement-unit.command';
import {
  CreateMeasurementUnitHttpDto,
  UpdateMeasurementUnitHttpDto,
} from '../dtos/http/measurement-unit-http.dto';
import { MeasurementUnitDto } from '../../application/dtos/measurement-unit.dto';

@ApiTags('Measurement Units')
@ApiBearerAuth('JWT-auth')
@Controller('measurement-units')
export class MeasurementUnitController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Permissions('listar-unidades-medida')
  @ApiOperation({ summary: 'Get all measurement units paginated' })
  async getAll(
    @Query() paginationHttpDto: PaginationParamsDto,
  ): Promise<HttpPaginatedResponseDto<MeasurementUnitDto>> {
    const { page, per_page } = paginationHttpDto;
    const paginationDto = new PaginationParamsDto(page, per_page);

    const [items, totalItems] = await this.queryBus.execute<
      GetAllMeasurementUnitsQuery,
      [MeasurementUnitDto[], number]
    >(new GetAllMeasurementUnitsQuery(paginationDto));

    const totalPages = Math.ceil(totalItems / per_page);

    return new HttpPaginatedResponseDto(
      items,
      totalItems,
      totalPages,
      page,
      per_page,
    );
  }

  @Get('active')
  @Permissions('listar-unidades-medida')
  @ApiOperation({ summary: 'Get all active measurement units' })
  async getActive(): Promise<MeasurementUnitDto[]> {
    return this.queryBus.execute(new GetActiveMeasurementUnitsQuery());
  }

  @Post()
  @Permissions('crear-unidad-medida')
  @ApiOperation({ summary: 'Create measurement unit' })
  async create(@Body() body: CreateMeasurementUnitHttpDto): Promise<void> {
    await this.commandBus.execute(
      new CreateMeasurementUnitCommand(body.name, body.abbreviation),
    );
  }

  @Put(':id')
  @Permissions('editar-unidad-medida')
  @ApiOperation({ summary: 'Update measurement unit' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMeasurementUnitHttpDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateMeasurementUnitCommand(
        id,
        body.name,
        body.abbreviation,
        body.active,
      ),
    );
  }

  @Delete(':id')
  @Permissions('eliminar-unidad-medida')
  @ApiOperation({ summary: 'Delete measurement unit' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteMeasurementUnitCommand(id));
  }
}
