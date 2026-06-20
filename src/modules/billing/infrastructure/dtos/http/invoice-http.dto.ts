import { InvoiceDto, InvoiceLineDto } from '@/modules/billing/application/dtos/invoice.dto';

export class InvoiceLineHttpDto {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly subtotal: number,
    public readonly tax_amount: number,
    public readonly total: number,
    public readonly id_product?: string,
    public readonly id_invoice?: string,
  ) {}
}

export class InvoiceHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_reservation: string,
    public readonly id_customer: string,
    public readonly id_currency: string,
    public readonly invoice_number: string,
    public readonly issue_date: Date,
    public readonly subtotal: number,
    public readonly tax_rate: number,
    public readonly tax_amount: number,
    public readonly discount_amount: number,
    public readonly delivery_fee: number,
    public readonly damage_charges: number,
    public readonly total: number,
    public readonly status: { id: string; code: string; name: string; state_color: string; text_color: string; },
    public readonly due_date?: Date,
    public readonly notes?: string,
    public readonly fiscal_provider?: string,
    public readonly fiscal_id?: string,
    public readonly fiscal_status?: string,
    public readonly fiscal_response?: any,
    public readonly pdf_path?: string,
    public readonly id_created_by?: string,
    public readonly lines: InvoiceLineHttpDto[] = [],
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}

  public static fromDto(dto: InvoiceDto): InvoiceHttpDto {
    return new InvoiceHttpDto(
      dto.id!,
      dto.id_reservation,
      dto.id_customer,
      dto.id_currency,
      dto.invoice_number,
      dto.issue_date,
      dto.subtotal,
      dto.tax_rate,
      dto.tax_amount,
      dto.discount_amount,
      dto.delivery_fee,
      dto.damage_charges,
      dto.total,
      dto.status,
      dto.due_date,
      dto.notes,
      dto.fiscal_provider,
      dto.fiscal_id,
      dto.fiscal_status,
      dto.fiscal_response,
      dto.pdf_path,
      dto.id_created_by,
      dto.lines.map((l: InvoiceLineDto) => new InvoiceLineHttpDto(
        l.id!,
        l.description,
        l.quantity,
        l.unit_price,
        l.subtotal,
        l.tax_amount,
        l.total,
        l.id_product,
        l.id_invoice,
      )),
      dto.created_at,
      dto.updated_at,
    );
  }
}
