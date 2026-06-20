import { InvoiceProviderPort } from '../../application/ports/invoice-provider.port';
import { InternalInvoiceProvider } from '../gateways/internal-invoice.provider';
import { PdfService } from '../services/pdf.service';

export const invoiceProvidersConfig = [
  { provide: InvoiceProviderPort, useClass: InternalInvoiceProvider },
  PdfService,
];
