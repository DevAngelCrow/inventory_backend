import { InvoiceLineId } from '../value-objects/invoice-line-value-object/invoice-line-id';
import { InvoiceLineDescription } from '../value-objects/invoice-line-value-object/invoice-line-description';
import { InvoiceLineQuantity } from '../value-objects/invoice-line-value-object/invoice-line-quantity';
import { InvoiceLineUnitPrice } from '../value-objects/invoice-line-value-object/invoice-line-unit-price';
import { InvoiceLineSubtotal } from '../value-objects/invoice-line-value-object/invoice-line-subtotal';
import { InvoiceLineTaxAmount } from '../value-objects/invoice-line-value-object/invoice-line-tax-amount';
import { InvoiceLineTotal } from '../value-objects/invoice-line-value-object/invoice-line-total';
import { InvoiceLineIdProduct } from '../value-objects/invoice-line-value-object/invoice-line-id-product';
import { InvoiceLineIdInvoice } from '../value-objects/invoice-line-value-object/invoice-line-id-invoice';

export class InvoiceLine {
  constructor(
    private readonly description: InvoiceLineDescription,
    private readonly quantity: InvoiceLineQuantity,
    private readonly unit_price: InvoiceLineUnitPrice,
    private readonly subtotal: InvoiceLineSubtotal,
    private readonly tax_amount: InvoiceLineTaxAmount,
    private readonly total: InvoiceLineTotal,
    private readonly id_product?: InvoiceLineIdProduct,
    private readonly id_invoice?: InvoiceLineIdInvoice,
    private readonly id?: InvoiceLineId,
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
      new InvoiceLineDescription(data.description),
      new InvoiceLineQuantity(data.quantity),
      new InvoiceLineUnitPrice(data.unit_price),
      new InvoiceLineSubtotal(data.subtotal),
      new InvoiceLineTaxAmount(data.tax_amount),
      new InvoiceLineTotal(data.total),
      data.id_product ? new InvoiceLineIdProduct(data.id_product) : undefined,
      data.id_invoice ? new InvoiceLineIdInvoice(data.id_invoice) : undefined,
      data.id ? new InvoiceLineId(data.id) : undefined,
    );
  }

  public getId(): InvoiceLineId | undefined {
    return this.id;
  }
  public getIdInvoice(): InvoiceLineIdInvoice | undefined {
    return this.id_invoice;
  }
  public getIdProduct(): InvoiceLineIdProduct | undefined {
    return this.id_product;
  }
  public getDescription(): InvoiceLineDescription {
    return this.description;
  }
  public getQuantity(): InvoiceLineQuantity {
    return this.quantity;
  }
  public getUnitPrice(): InvoiceLineUnitPrice {
    return this.unit_price;
  }
  public getSubtotal(): InvoiceLineSubtotal {
    return this.subtotal;
  }
  public getTaxAmount(): InvoiceLineTaxAmount {
    return this.tax_amount;
  }
  public getTotal(): InvoiceLineTotal {
    return this.total;
  }
}
