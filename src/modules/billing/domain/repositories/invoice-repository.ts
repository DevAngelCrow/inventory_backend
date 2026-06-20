import { Invoice } from '../entities/invoice';
import { InvoiceId } from '../value-objects/invoice-id';

export abstract class InvoiceRepository {
  abstract save(invoice: Invoice): Promise<Invoice>;
  abstract findById(id: InvoiceId): Promise<Invoice | null>;
}
