import { InvoiceRepository } from '../../domain/repositories/invoice-repository';
import { InvoiceQueriesRepository } from '../../application/repositories/invoice-read.repository';
import { ImplInvoiceRepository } from '../implementation/invoice/impl-invoice.repository';

export const invoiceRepositories = [
  { provide: InvoiceRepository, useClass: ImplInvoiceRepository },
  { provide: InvoiceQueriesRepository, useClass: ImplInvoiceRepository },
];
