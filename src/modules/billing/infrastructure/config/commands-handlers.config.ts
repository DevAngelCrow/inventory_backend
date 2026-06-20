import { GenerateInvoiceHandler } from '../../application/commands/generate-invoice/generate-invoice.handler';
import { UpdateInvoiceStatusHandler } from '../../application/commands/update-invoice-status/update-invoice-status.handler';

export const invoiceCommandHandlerProviders = [
  GenerateInvoiceHandler,
  UpdateInvoiceStatusHandler,
];
