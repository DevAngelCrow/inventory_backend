export class InvoiceLineDto {
  constructor(
    public readonly description: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly subtotal: number,
    public readonly tax_amount: number,
    public readonly total: number,
    public readonly id_product?: string,
    public readonly id_invoice?: string,
    public readonly id?: string,
  ) {}
}

export class InvoiceDto {
  constructor(
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
    public readonly status: {
      id: string;
      code: string;
      name: string;
      state_color: string;
      text_color: string;
    },
    public readonly due_date?: Date,
    public readonly notes?: string,
    public readonly fiscal_provider?: string,
    public readonly fiscal_id?: string,
    public readonly fiscal_status?: string,
    public readonly fiscal_response?: any,
    public readonly pdf_path?: string,
    public readonly id_created_by?: string,
    public readonly lines: InvoiceLineDto[] = [],
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly mnt_customer?: {
      first_name: string;
      last_name: string;
      email?: string | null;
      phone?: string | null;
    },
  ) {}
}
