import { InvoiceId } from '../value-objects/invoice-value-object/invoice-id';
import { InvoiceStatus } from '../value-objects/invoice-value-object/invoice-status';
import { InvoiceAmount } from '../value-objects/invoice-value-object/invoice-amount';
import { InvoiceIdReservation } from '../value-objects/invoice-value-object/invoice-id-reservation';
import { InvoiceIdCustomer } from '../value-objects/invoice-value-object/invoice-id-customer';
import { InvoiceIdCurrency } from '../value-objects/invoice-value-object/invoice-id-currency';
import { InvoiceNumber } from '../value-objects/invoice-value-object/invoice-number';
import { InvoiceIssueDate } from '../value-objects/invoice-value-object/invoice-issue-date';
import { InvoiceDueDate } from '../value-objects/invoice-value-object/invoice-due-date';
import { InvoiceNotes } from '../value-objects/invoice-value-object/invoice-notes';
import { InvoiceFiscalProvider } from '../value-objects/invoice-value-object/invoice-fiscal-provider';
import { InvoiceFiscalId } from '../value-objects/invoice-value-object/invoice-fiscal-id';
import { InvoiceFiscalStatus } from '../value-objects/invoice-value-object/invoice-fiscal-status';
import { InvoiceFiscalResponse } from '../value-objects/invoice-value-object/invoice-fiscal-response';
import { InvoicePdfPath } from '../value-objects/invoice-value-object/invoice-pdf-path';
import { InvoiceIdCreatedBy } from '../value-objects/invoice-value-object/invoice-id-created-by';
import { InvoiceLine } from './invoice-line';
import { DomainException } from '@/shared/domain/exceptions/domain.exception';

export class Invoice {
  constructor(
    private readonly id_reservation: InvoiceIdReservation,
    private readonly id_customer: InvoiceIdCustomer,
    private readonly id_currency: InvoiceIdCurrency,
    private readonly invoice_number: InvoiceNumber,
    private readonly issue_date: InvoiceIssueDate,
    private readonly amount: InvoiceAmount,
    private status: InvoiceStatus,
    private readonly due_date?: InvoiceDueDate,
    private readonly notes?: InvoiceNotes,
    private readonly fiscal_provider?: InvoiceFiscalProvider,
    private readonly fiscal_id?: InvoiceFiscalId,
    private readonly fiscal_status?: InvoiceFiscalStatus,
    private readonly fiscal_response?: InvoiceFiscalResponse,
    private readonly pdf_path?: InvoicePdfPath,
    private readonly id_created_by?: InvoiceIdCreatedBy,
    private readonly lines: InvoiceLine[] = [],
    private readonly id?: InvoiceId,
  ) {}

  static create(data: {
    id_reservation: string;
    id_customer: string;
    id_currency: string;
    invoice_number: string;
    issue_date: Date | string | number;
    amount: {
      subtotal: number;
      taxRate: number;
      taxAmount: number;
      discountAmount: number;
      deliveryFee: number;
      damageCharges: number;
      total: number;
    };
    status: string;
    due_date?: Date | string | number;
    notes?: string;
    fiscal_provider?: string;
    fiscal_id?: string;
    fiscal_status?: string;
    fiscal_response?: any;
    pdf_path?: string;
    id_created_by?: string;
    lines?: {
      description: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
      tax_amount: number;
      total: number;
      id_product?: string;
      id?: string;
    }[];
    id?: string;
  }): Invoice {
    return new Invoice(
      new InvoiceIdReservation(data.id_reservation),
      new InvoiceIdCustomer(data.id_customer),
      new InvoiceIdCurrency(data.id_currency),
      new InvoiceNumber(data.invoice_number),
      new InvoiceIssueDate(data.issue_date),
      new InvoiceAmount(
        data.amount.subtotal,
        data.amount.taxRate,
        data.amount.taxAmount,
        data.amount.discountAmount,
        data.amount.deliveryFee,
        data.amount.damageCharges,
        data.amount.total,
      ),
      new InvoiceStatus(data.status),
      data.due_date ? new InvoiceDueDate(data.due_date) : undefined,
      data.notes ? new InvoiceNotes(data.notes) : undefined,
      data.fiscal_provider
        ? new InvoiceFiscalProvider(data.fiscal_provider)
        : undefined,
      data.fiscal_id ? new InvoiceFiscalId(data.fiscal_id) : undefined,
      data.fiscal_status
        ? new InvoiceFiscalStatus(data.fiscal_status)
        : undefined,
      data.fiscal_response
        ? new InvoiceFiscalResponse(data.fiscal_response)
        : undefined,
      data.pdf_path ? new InvoicePdfPath(data.pdf_path) : undefined,
      data.id_created_by
        ? new InvoiceIdCreatedBy(data.id_created_by)
        : undefined,
      data.lines?.map((line) =>
        InvoiceLine.create({ ...line, id_invoice: data.id }),
      ) ?? [],
      data.id ? new InvoiceId(data.id) : undefined,
    );
  }

  public getId(): InvoiceId | undefined {
    return this.id;
  }
  public getIdReservation(): InvoiceIdReservation {
    return this.id_reservation;
  }
  public getIdCustomer(): InvoiceIdCustomer {
    return this.id_customer;
  }
  public getIdCurrency(): InvoiceIdCurrency {
    return this.id_currency;
  }
  public getInvoiceNumber(): InvoiceNumber {
    return this.invoice_number;
  }
  public getIssueDate(): InvoiceIssueDate {
    return this.issue_date;
  }
  public getAmount(): InvoiceAmount {
    return this.amount;
  }
  public getStatus(): InvoiceStatus {
    return this.status;
  }
  public getDueDate(): InvoiceDueDate | undefined {
    return this.due_date;
  }
  public getNotes(): InvoiceNotes | undefined {
    return this.notes;
  }
  public getFiscalProvider(): InvoiceFiscalProvider | undefined {
    return this.fiscal_provider;
  }
  public getFiscalId(): InvoiceFiscalId | undefined {
    return this.fiscal_id;
  }
  public getFiscalStatus(): InvoiceFiscalStatus | undefined {
    return this.fiscal_status;
  }
  public getFiscalResponse(): InvoiceFiscalResponse | undefined {
    return this.fiscal_response;
  }
  public getPdfPath(): InvoicePdfPath | undefined {
    return this.pdf_path;
  }
  public getIdCreatedBy(): InvoiceIdCreatedBy | undefined {
    return this.id_created_by;
  }
  public getLines(): InvoiceLine[] {
    return this.lines;
  }

  public void(): void {
    if (this.status.value() === 'VOIDED') {
      throw new DomainException('Invoice is already voided');
    }
    if (this.status.value() === 'PAID') {
      throw new DomainException('Cannot void a paid invoice');
    }
    this.status = new InvoiceStatus('VOIDED');
  }

  public issue(): void {
    if (this.status.value() !== 'DRAFT') {
      throw new DomainException(`Cannot issue invoice from status ${this.status.value()}`);
    }
    if (!this.lines || this.lines.length === 0) {
      throw new DomainException('Cannot issue invoice without lines');
    }
    if (this.amount.total <= 0) {
      throw new DomainException('Cannot issue invoice with total 0 or less');
    }
    this.status = new InvoiceStatus('ISSUED');
  }

  public updateStatus(status: string): void {
    this.status = new InvoiceStatus(status);
  }
}
