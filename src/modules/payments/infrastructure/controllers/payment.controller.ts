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
  Patch,
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
import { GetPaymentMethodsQuery } from '../../application/queries/get-payment-methods/get-payment-methods.query';
import { VoidPaymentCommand } from '../../application/commands/void-payment/void-payment.command';

@ApiTags('Payments')
@Controller()
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
      dto.id_invoice,
    );
    const result: Payment = await this.commandBus.execute(command);

    // Convert entity to DTO for HTTP mapping
    const dtoResult = new PaymentDto(
      result.getIdReservation().value(),
      result.getIdPaymentMethod().value(),
      result.getAmount().value(),
      result.getPaymentDate().value(),
      {
        id: '',
        code: result.getStatus().value(),
        name: result.getStatus().value(),
        state_color: 'primary',
        text_color: 'primary-foreground',
      }, // Mock object for DTO compatibility
      undefined, // payment_number
      result.getReferenceNumber()?.value(),
      result.getNotes()?.value(),
      result.getGatewayProvider()?.value(),
      result.getGatewayTxId()?.value(),
      result.getGatewayResponse()?.value(),
      result.getIdReceivedBy()?.value(),
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
  @ApiQuery({ name: 'id_reservation', required: false, type: String })
  async getAll(
    @Query() query: GetPaymentsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<PaymentHttpDto>>> {
    const appQuery = new GetPaymentsQuery(
      query,
      query.filter_reservation,
      query.filter_status,
      query.id_reservation,
    );
    const result = await this.queryBus.execute<
      GetPaymentsQuery,
      Pagination<PaymentDto> | PaymentDto[]
    >(appQuery);

    const items =
      result instanceof Pagination ? result.getEntityList() : result;
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

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

  @Permissions('listar-pagos')
  @Get('methods')
  @HttpCode(HttpStatus.OK)
  async getMethods() {
    const methods = await this.queryBus.execute(new GetPaymentMethodsQuery());
    return new SuccessResponseDto(
      methods,
      HttpStatus.OK,
      'Payment methods retrieved successfully',
    );
  }

  @Permissions('anular-pago')
  @Patch(':id/void')
  @HttpCode(HttpStatus.OK)
  async voidPayment(@Param('id', ParseUUIDPipe) id: string) {
    await this.commandBus.execute(new VoidPaymentCommand(id));
    return new SuccessResponseDto(
      null,
      HttpStatus.OK,
      'Payment voided successfully',
    );
  }
}
