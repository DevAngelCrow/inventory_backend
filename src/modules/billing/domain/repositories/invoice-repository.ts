import { Invoice } from '../entities/invoice';

export abstract class InvoiceRepository {
  abstract save(invoice: Invoice): Promise<Invoice>;
}
