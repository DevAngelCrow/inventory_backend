import { GetInvoicesHandler } from '../../application/queries/get-invoices/get-invoices.handler';
import { GetInvoiceHandler } from '../../application/queries/get-invoice/get-invoice.handler';
import { GetInvoicePdfHandler } from '../../application/queries/get-invoice-pdf/get-invoice-pdf.handler';

export const invoiceQueryHandlerProviders = [
  GetInvoicesHandler,
  GetInvoiceHandler,
  GetInvoicePdfHandler,
];
