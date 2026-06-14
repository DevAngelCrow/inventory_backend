import { InvoiceId } from '../value-objects/invoice-id';
import { InvoiceStatus } from '../value-objects/invoice-status';
import { InvoiceAmount } from '../value-objects/invoice-amount';
import { InvoiceLine } from './invoice-line';

export class Invoice {
  constructor(
    private readonly id_reservation: string,
    private readonly id_customer: string,
    private readonly id_currency: string,
    private readonly invoice_number: string,
    private readonly issue_date: Date,
    private readonly amount: InvoiceAmount,
    private readonly status: InvoiceStatus,
    private readonly due_date?: Date,
    private readonly notes?: string,
    private readonly fiscal_provider?: string,
    private readonly fiscal_id?: string,
    private readonly fiscal_status?: string,
    private readonly fiscal_response?: any,
    private readonly pdf_path?: string,
    private readonly id_created_by?: string,
    private readonly lines: InvoiceLine[] = [],
    private readonly id?: InvoiceId,
  ) {}

  static create(data: {
    id_reservation: string;
    id_customer: string;
    id_currency: string;
    invoice_number: string;
    issue_date: Date;
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
    due_date?: Date;
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
      data.id_reservation,
      data.id_customer,
      data.id_currency,
      data.invoice_number,
      data.issue_date,
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
      data.due_date,
      data.notes,
      data.fiscal_provider,
      data.fiscal_id,
      data.fiscal_status,
      data.fiscal_response,
      data.pdf_path,
      data.id_created_by,
      data.lines?.map((line) => InvoiceLine.create({ ...line, id_invoice: data.id })) ?? [],
      data.id ? new InvoiceId(data.id) : undefined,
    );
  }

  public getId(): InvoiceId | undefined { return this.id; }
  public getIdReservation(): string { return this.id_reservation; }
  public getIdCustomer(): string { return this.id_customer; }
  public getIdCurrency(): string { return this.id_currency; }
  public getInvoiceNumber(): string { return this.invoice_number; }
  public getIssueDate(): Date { return this.issue_date; }
  public getAmount(): InvoiceAmount { return this.amount; }
  public getStatus(): InvoiceStatus { return this.status; }
  public getDueDate(): Date | undefined { return this.due_date; }
  public getNotes(): string | undefined { return this.notes; }
  public getFiscalProvider(): string | undefined { return this.fiscal_provider; }
  public getFiscalId(): string | undefined { return this.fiscal_id; }
  public getFiscalStatus(): string | undefined { return this.fiscal_status; }
  public getFiscalResponse(): any { return this.fiscal_response; }
  public getPdfPath(): string | undefined { return this.pdf_path; }
  public getIdCreatedBy(): string | undefined { return this.id_created_by; }
  public getLines(): InvoiceLine[] { return this.lines; }
}
