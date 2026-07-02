import { Injectable } from '@nestjs/common';
import {
  InvoiceProviderPort,
  GenerateInvoiceParams,
  GenerateInvoiceResult,
} from '@/modules/billing/application/ports/invoice-provider.port';

@Injectable()
export class InternalInvoiceProvider implements InvoiceProviderPort {
  async generate(
    params: GenerateInvoiceParams,
  ): Promise<GenerateInvoiceResult> {
    // Aquí iría la lógica para generar un PDF o una factura interna.
    // Como es interno, el fiscalStatus puede ser 'NOT_APPLICABLE' o similar.
    return {
      fiscalProvider: 'INTERNAL',
      fiscalId: `INT-${Date.now()}`,
      fiscalStatus: 'COMPLETED',
      fiscalResponse: {
        generatedAt: new Date().toISOString(),
        internalReference: params.invoiceNumber,
      },
      pdfPath: `/invoices/${params.invoiceNumber}.pdf`, // Simulación de ruta de PDF
    };
  }
}
