import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
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
  ) { }

  @Get()
  @Permissions('listar-unidades-medida')
  @ApiOperation({ summary: 'Get all measurement units paginated' })
  async getAll(
    @Query() paginationHttpDto: PaginationParamsDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<MeasurementUnitDto>>> {
    const { page, per_page } = paginationHttpDto;
    const paginationDto = new PaginationParamsDto(page, per_page);

    const [items, totalItems] = await this.queryBus.execute<
      GetAllMeasurementUnitsQuery,
      [MeasurementUnitDto[], number]
    >(new GetAllMeasurementUnitsQuery(paginationDto));

    const totalPages = Math.ceil(totalItems / per_page);

    const response = new HttpPaginatedResponseDto(
      items,
      totalItems,
      totalPages,
      page,
      per_page,
    );

    return new SuccessResponseDto(
      response,
      200,
      'Measurement units retrieved successfully',
    );
  }

  @Get('active')
  @Permissions('listar-unidades-medida')
  @ApiOperation({ summary: 'Get all active measurement units' })
  async getActive(): Promise<MeasurementUnitDto[]> {
    return this.queryBus.execute(new GetActiveMeasurementUnitsQuery());
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('crear-unidad-medida')
  @ApiOperation({ summary: 'Create measurement unit' })
  async create(@Body() body: CreateMeasurementUnitHttpDto): Promise<SuccessResponseDto<null>> {
    await this.commandBus.execute(
      new CreateMeasurementUnitCommand(body.name, body.abbreviation),
    );
    return new SuccessResponseDto(null, HttpStatus.CREATED, 'Measurement unit created successfully');
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('editar-unidad-medida')
  @ApiOperation({ summary: 'Update measurement unit' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMeasurementUnitHttpDto,
  ): Promise<SuccessResponseDto<null>> {
    await this.commandBus.execute(
      new UpdateMeasurementUnitCommand(
        id,
        body.name,
        body.abbreviation,
        body.active,
      ),
    );
    return new SuccessResponseDto(null, HttpStatus.OK, 'Measurement unit updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('eliminar-unidad-medida')
  @ApiOperation({ summary: 'Delete measurement unit' })
  async delete(@Param('id') id: string): Promise<SuccessResponseDto<null>> {
    await this.commandBus.execute(new DeleteMeasurementUnitCommand(id));
    return new SuccessResponseDto(null, HttpStatus.OK, 'Measurement unit deleted successfully');
  }
}
