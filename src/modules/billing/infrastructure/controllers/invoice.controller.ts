import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { Response } from 'express';

import { GenerateInvoiceDto } from '../dtos/validators/invoice/generate-invoice.dto';
import { GetInvoicesQueryDto } from '../dtos/query/get-invoices-query.dto';
import { InvoiceHttpDto } from '../dtos/http/invoice-http.dto';

import { GenerateInvoiceCommand } from '../../application/commands/generate-invoice/generate-invoice.command';
import { UpdateInvoiceStatusCommand } from '../../application/commands/update-invoice-status/update-invoice-status.command';
import { GetInvoicesQuery } from '../../application/queries/get-invoices/get-invoices.query';
import { GetInvoiceQuery } from '../../application/queries/get-invoice/get-invoice.query';
import { InvoiceDto } from '../../application/dtos/invoice.dto';
import { PdfService } from '../services/pdf.service';

@ApiTags('Billing')
@Controller('invoices')
@ApiBearerAuth('JWT-auth')
export class InvoiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly pdfService: PdfService,
  ) {}

  @Permissions('generar-factura')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async generateInvoice(
    @Body() dto: GenerateInvoiceDto,
  ): Promise<SuccessResponseDto<void>> {
    const command = new GenerateInvoiceCommand(
      dto.id_reservation,
      dto.id_customer,
      dto.id_currency,
      dto.issue_date,
      dto.due_date,
      dto.subtotal,
      dto.tax_rate,
      dto.tax_amount,
      dto.discount_amount,
      dto.delivery_fee,
      dto.damage_charges,
      dto.total,
      dto.status,
      dto.notes,
      dto.id_created_by,
      dto.lines,
    );
    await this.commandBus.execute(command);
    
    return new SuccessResponseDto(
      undefined as void,
      HttpStatus.CREATED,
      'Invoice generated successfully',
    );
  }

  @Permissions('listar-facturas')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_reservation', required: false, type: String })
  @ApiQuery({ name: 'filter_customer', required: false, type: String })
  @ApiQuery({ name: 'filter_status', required: false, type: String })
  async getAll(
    @Query() query: GetInvoicesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<InvoiceHttpDto>>> {
    const appQuery = new GetInvoicesQuery(
      query,
      query.filter_reservation,
      query.filter_customer,
      query.filter_status,
    );
    const result = await this.queryBus.execute<
      GetInvoicesQuery,
      Pagination<InvoiceDto> | InvoiceDto[]
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : (result as InvoiceDto[]);
    const totalItems = result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages = result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: InvoiceDto) => InvoiceHttpDto.fromDto(c));
    const response = new HttpPaginatedResponseDto<InvoiceHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Invoices retrieved successfully',
    );
  }

  @Permissions('emitir-factura')
  @Patch(':id/issue')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async issueInvoice(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateInvoiceStatusCommand(id, 'ISSUED');
    await this.commandBus.execute(command);
    return new SuccessResponseDto(
      null,
      HttpStatus.OK,
      'Invoice issued successfully',
    );
  }

  @Permissions('anular-factura')
  @Patch(':id/void')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async voidInvoice(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateInvoiceStatusCommand(id, 'VOIDED');
    await this.commandBus.execute(command);
    return new SuccessResponseDto(
      null,
      HttpStatus.OK,
      'Invoice voided successfully',
    );
  }

  @Permissions('descargar-factura-pdf')
  @Get(':id/pdf')
  @ApiParam({ name: 'id', required: true, type: String })
  async downloadPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const query = new GetInvoiceQuery(id);
    const invoice: InvoiceDto | null = await this.queryBus.execute(query);

    if (!invoice) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Invoice not found',
      });
    }

    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="factura-${invoice.invoice_number}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
