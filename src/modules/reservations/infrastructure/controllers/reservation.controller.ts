import {
  Body,
  Controller,
  Delete,
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

import { CreateReservationDto } from '../dtos/validators/reservation/create-reservation.dto';
import { UpdateReservationDto } from '../dtos/validators/reservation/update-reservation.dto';
import { UpdateReservationStatusDto } from '../dtos/validators/reservation/update-reservation-status.dto';
import { GetReservationsQueryDto } from '../dtos/query/get-reservations-query.dto';
import { ReservationHttpDto } from '../dtos/http/reservation-http.dto';

import { CreateReservationCommand } from '../../application/commands/create-reservation/create-reservation.command';
import { UpdateReservationCommand } from '../../application/commands/update-reservation/update-reservation.command';
import { UpdateReservationStatusCommand } from '../../application/commands/update-reservation-status/update-reservation-status.command';
import { DeleteReservationCommand } from '../../application/commands/delete-reservation/delete-reservation.command';
import { GetReservationsQuery } from '../../application/queries/get-reservations/get-reservations.query';
import { GetReservationQuery } from '../../application/queries/get-reservation/get-reservation.query';
import { ReservationDto } from '../../application/dtos/reservation.dto';

@ApiTags('Reservations')
@Controller()
@ApiBearerAuth('JWT-auth')
export class ReservationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('crear-reserva')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateReservationDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateReservationCommand(
      dto.id_customer,
      dto.event_start,
      dto.event_end,
      dto.total_amount,
      dto.items.map(i => ({
        id_product: i.id_product,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
      })),
      dto.delivery_address,
      dto.deposit_amount,
      dto.balance_due,
      dto.notes,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Reservation created successfully',
    );
  }

  @Permissions('editar-reserva')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateReservationCommand(
      id,
      dto.id_customer,
      dto.status,
      dto.event_start,
      dto.event_end,
      dto.total_amount,
      dto.items.map(i => ({
        id_product: i.id_product,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
      })),
      dto.delivery_address,
      dto.deposit_amount,
      dto.balance_due,
      dto.notes,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Reservation updated successfully',
    );
  }

  @Permissions('editar-reserva')
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateReservationStatusCommand(id, dto.status);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Reservation status updated successfully',
    );
  }

  @Permissions('listar-reservas')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_customer', required: false, type: String })
  @ApiQuery({ name: 'filter_status', required: false, type: String })
  @ApiQuery({ name: 'filter_date_start', required: false, type: Date })
  @ApiQuery({ name: 'filter_date_end', required: false, type: Date })
  async getAll(
    @Query() query: GetReservationsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<ReservationHttpDto>>> {
    const appQuery = new GetReservationsQuery(
      query,
      query.filter_customer,
      query.filter_status,
      query.filter_date_start,
      query.filter_date_end,
    );
    const result = await this.queryBus.execute<
      GetReservationsQuery,
      Pagination<ReservationDto> | ReservationDto[]
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : (result as ReservationDto[]);
    const totalItems = result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages = result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: ReservationDto) => ReservationHttpDto.fromDto(c));
    const response = new HttpPaginatedResponseDto<ReservationHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Reservations retrieved successfully',
    );
  }

  @Permissions('ver-reserva')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<ReservationHttpDto>> {
    const query = new GetReservationQuery(id);
    const result: ReservationDto | null = await this.queryBus.execute(query);
    if (!result) {
      throw new NotFoundException('Reservation', id);
    }
    return new SuccessResponseDto(
      ReservationHttpDto.fromDto(result),
      HttpStatus.OK,
      'Reservation retrieved successfully',
    );
  }

  @Permissions('eliminar-reserva')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteReservationCommand(id);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Reservation deleted successfully',
    );
  }
}
