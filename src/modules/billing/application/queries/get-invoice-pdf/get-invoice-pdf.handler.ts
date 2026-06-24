import { IQueryHandler, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GetInvoicePdfQuery } from './get-invoice-pdf.query';
import { PdfService } from '../../../infrastructure/services/pdf.service';
import { GetInvoiceQuery } from '../get-invoice/get-invoice.query';
import { InvoiceDto } from '../../dtos/invoice.dto';

@QueryHandler(GetInvoicePdfQuery)
export class GetInvoicePdfHandler implements IQueryHandler<GetInvoicePdfQuery> {
  constructor(
    private readonly pdfService: PdfService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetInvoicePdfQuery): Promise<{ buffer: Buffer; fileName: string }> {
    const getInvoiceQuery = new GetInvoiceQuery(query.id_invoice);
    const invoice: InvoiceDto | null = await this.queryBus.execute(getInvoiceQuery);

    if (!invoice) {
      throw new NotFoundException('Invoice', query.id_invoice);
    }

    const buffer = await this.pdfService.generateInvoicePdf(invoice);
    return { buffer, fileName: `factura-${invoice.invoice_number}.pdf` };
  }
}
