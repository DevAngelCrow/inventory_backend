import { Invoice } from '../entities/invoice';
import { InvoiceId } from '../value-objects/invoice-value-object/invoice-id';

export abstract class InvoiceRepository {
  abstract save(invoice: Invoice): Promise<Invoice>;
  abstract findById(id: InvoiceId): Promise<Invoice | null>;
}
