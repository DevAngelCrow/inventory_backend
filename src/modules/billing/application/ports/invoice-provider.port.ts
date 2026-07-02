export interface GenerateInvoiceParams {
  invoiceNumber: string;
  issueDate: Date;
  customer: {
    id: string;
    name?: string;
    documentType?: string;
    documentNumber?: string;
    address?: string;
  };
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    taxAmount: number;
    total: number;
  }[];
  totals: {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    deliveryFee: number;
    damageCharges: number;
    total: number;
  };
}

export interface GenerateInvoiceResult {
  fiscalProvider: string;
  fiscalId?: string;
  fiscalStatus?: string;
  fiscalResponse?: any;
  pdfPath?: string;
}

export abstract class InvoiceProviderPort {
  abstract generate(
    params: GenerateInvoiceParams,
  ): Promise<GenerateInvoiceResult>;
}
