export class GenerateInvoiceLineCommand {
  constructor(
    public readonly description: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly subtotal: number,
    public readonly tax_amount: number,
    public readonly total: number,
    public readonly id_product?: string,
  ) {}
}

export class GenerateInvoiceCommand {
  constructor(
    public readonly id_reservation: string,
    public readonly id_customer: string,
    public readonly id_currency: string,
    public readonly issue_date: Date,
    public readonly due_date?: Date,
    public readonly subtotal: number = 0,
    public readonly tax_rate: number = 0,
    public readonly tax_amount: number = 0,
    public readonly discount_amount: number = 0,
    public readonly delivery_fee: number = 0,
    public readonly damage_charges: number = 0,
    public readonly total: number = 0,
    public readonly status: string = 'DRAFT',
    public readonly notes?: string,
    public readonly id_created_by?: string,
    public readonly lines: GenerateInvoiceLineCommand[] = [],
  ) {}
}
