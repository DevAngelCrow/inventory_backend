import { InvoiceProviderPort } from '../../application/ports/invoice-provider.port';
import { InternalInvoiceProvider } from '../gateways/internal-invoice.provider';

export const invoiceProvidersConfig = [
  { provide: InvoiceProviderPort, useClass: InternalInvoiceProvider },
];
