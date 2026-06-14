import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';

import { ProcessPaymentDto } from '../dtos/validators/payment/process-payment.dto';
import { GetPaymentsQueryDto } from '../dtos/query/get-payments-query.dto';
import { PaymentHttpDto } from '../dtos/http/payment-http.dto';

import { ProcessPaymentCommand } from '../../application/commands/process-payment/process-payment.command';
import { GetPaymentsQuery } from '../../application/queries/get-payments/get-payments.query';
import { PaymentDto } from '../../application/dtos/payment.dto';
import { Payment } from '../../domain/entities/payment';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth('JWT-auth')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('procesar-pago')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async processPayment(
    @Body() dto: ProcessPaymentDto,
  ): Promise<SuccessResponseDto<PaymentHttpDto>> {
    const command = new ProcessPaymentCommand(
      dto.id_reservation,
      dto.id_payment_method,
      dto.payment_method_code,
      dto.amount,
      dto.id_currency,
      dto.payment_date,
      dto.reference_number,
      dto.notes,
      dto.id_received_by,
    );
    const result: Payment = await this.commandBus.execute(command);
    
    // Convert entity to DTO for HTTP mapping
    const dtoResult = new PaymentDto(
      result.getIdReservation(),
      result.getIdPaymentMethod().value(),
      result.getAmount().value(),
      result.getPaymentDate().value(),
      result.getStatus().value(),
      undefined, // payment_number is not accessible via entity methods directly, but let's assume UI doesn't need it on creation sync or we add a getter. We will omit it in this response.
      result.getReferenceNumber(),
      result.getNotes(),
      result.getGatewayProvider(),
      result.getGatewayTxId(),
      result.getGatewayResponse(),
      result.getIdReceivedBy(),
      result.getId()?.value(),
    );

    return new SuccessResponseDto(
      PaymentHttpDto.fromDto(dtoResult),
      HttpStatus.CREATED,
      'Payment processed successfully',
    );
  }

  @Permissions('listar-pagos')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_reservation', required: false, type: String })
  @ApiQuery({ name: 'filter_status', required: false, type: String })
  async getAll(
    @Query() query: GetPaymentsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<PaymentHttpDto>>> {
    const appQuery = new GetPaymentsQuery(
      query,
      query.filter_reservation,
      query.filter_status,
    );
    const result = await this.queryBus.execute<
      GetPaymentsQuery,
      Pagination<PaymentDto> | PaymentDto[]
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : (result as PaymentDto[]);
    const totalItems = result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages = result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: PaymentDto) => PaymentHttpDto.fromDto(c));
    const response = new HttpPaginatedResponseDto<PaymentHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Payments retrieved successfully',
    );
  }
}
