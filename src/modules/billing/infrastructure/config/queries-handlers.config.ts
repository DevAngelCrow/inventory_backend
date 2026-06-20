import { GetInvoicesHandler } from '../../application/queries/get-invoices/get-invoices.handler';
import { GetInvoiceHandler } from '../../application/queries/get-invoice/get-invoice.handler';

export const invoiceQueryHandlerProviders = [
  GetInvoicesHandler,
  GetInvoiceHandler,
];
