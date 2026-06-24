import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';

import { RecordInspectionDto } from '../dtos/validators/inspection/record-inspection.dto';
import { GetInspectionsQueryDto } from '../dtos/query/get-inspections-query.dto';
import { InspectionHttpDto } from '../dtos/http/inspection-http.dto';

import { RecordInspectionCommand } from '../../application/commands/record-inspection/record-inspection.command';
import { GetInspectionsQuery } from '../../application/queries/get-inspections/get-inspections.query';
import { InspectionDto } from '../../application/dtos/inspection.dto';

@ApiTags('Inspections')
@Controller('inspections')
@ApiBearerAuth('JWT-auth')
export class InspectionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('registrar-inspeccion')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async recordInspection(
    @Body() dto: RecordInspectionDto,
  ): Promise<SuccessResponseDto<void>> {
    const command = new RecordInspectionCommand(
      dto.id_reservation,
      dto.inspection_date,
      dto.overall_condition,
      dto.status,
      dto.damage_items?.map((i) => ({
        id_product: i.id_product,
        damage_type: i.damage_type,
        description: i.description,
        quantity_affected: i.quantity_affected,
        charge_amount: i.charge_amount,
        photo_url: i.photo_url,
      })) || [],
      dto.general_notes,
      dto.total_charges,
      dto.id_inspected_by,
    );
    await this.commandBus.execute(command);

    return new SuccessResponseDto(
      undefined,
      HttpStatus.CREATED,
      'Inspection recorded successfully',
    );
  }

  @Permissions('listar-inspecciones')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_reservation', required: false, type: String })
  @ApiQuery({ name: 'filter_status', required: false, type: String })
  async getAll(
    @Query() query: GetInspectionsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<InspectionHttpDto>>> {
    const appQuery = new GetInspectionsQuery(
      query,
      query.filter_reservation,
      query.filter_status,
    );
    const result = await this.queryBus.execute<
      GetInspectionsQuery,
      Pagination<InspectionDto> | InspectionDto[]
    >(appQuery);

    const items =
      result instanceof Pagination ? result.getEntityList() : result;
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: InspectionDto) =>
      InspectionHttpDto.fromDto(c),
    );
    const response = new HttpPaginatedResponseDto<InspectionHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Inspections retrieved successfully',
    );
  }
}
