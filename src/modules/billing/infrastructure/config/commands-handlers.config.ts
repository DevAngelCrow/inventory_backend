import { GenerateInvoiceHandler } from '../../application/commands/generate-invoice/generate-invoice.handler';
import { UpdateInvoiceStatusHandler } from '../../application/commands/update-invoice-status/update-invoice-status.handler';
import { MarkInvoicesAsPaidByReservationHandler } from '../../application/commands/mark-invoices-paid-by-reservation/mark-invoices-paid-by-reservation.handler';

export const invoiceCommandHandlerProviders = [
  GenerateInvoiceHandler,
  UpdateInvoiceStatusHandler,
  MarkInvoicesAsPaidByReservationHandler,
];
