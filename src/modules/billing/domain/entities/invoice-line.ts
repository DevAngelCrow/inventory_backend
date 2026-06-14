export class InvoiceLine {
  constructor(
    private readonly description: string,
    private readonly quantity: number,
    private readonly unit_price: number,
    private readonly subtotal: number,
    private readonly tax_amount: number,
    private readonly total: number,
    private readonly id_product?: string,
    private readonly id_invoice?: string,
    private readonly id?: string,
  ) {}

  static create(data: {
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    tax_amount: number;
    total: number;
    id_product?: string;
    id_invoice?: string;
    id?: string;
  }): InvoiceLine {
    return new InvoiceLine(
      data.description,
      data.quantity,
      data.unit_price,
      data.subtotal,
      data.tax_amount,
      data.total,
      data.id_product,
      data.id_invoice,
      data.id,
    );
  }

  public getId(): string | undefined { return this.id; }
  public getIdInvoice(): string | undefined { return this.id_invoice; }
  public getIdProduct(): string | undefined { return this.id_product; }
  public getDescription(): string { return this.description; }
  public getQuantity(): number { return this.quantity; }
  public getUnitPrice(): number { return this.unit_price; }
  public getSubtotal(): number { return this.subtotal; }
  public getTaxAmount(): number { return this.tax_amount; }
  public getTotal(): number { return this.total; }
}
