import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateInvoiceCommand } from './generate-invoice.command';
import { InvoiceRepository } from '@/modules/billing/domain/repositories/invoice-repository';
import { InvoiceProviderPort } from '@/modules/billing/application/ports/invoice-provider.port';
import { Invoice } from '@/modules/billing/domain/entities/invoice';

@CommandHandler(GenerateInvoiceCommand)
export class GenerateInvoiceHandler implements ICommandHandler<GenerateInvoiceCommand> {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly invoiceProvider: InvoiceProviderPort,
  ) {}

  async execute(command: GenerateInvoiceCommand): Promise<Invoice> {
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // 1. Generate via provider (e.g. fiscal generation, or internal PDF)
    const result = await this.invoiceProvider.generate({
      invoiceNumber,
      issueDate: command.issue_date,
      customer: {
        id: command.id_customer,
      },
      lines: command.lines.map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unit_price,
        subtotal: l.subtotal,
        taxAmount: l.tax_amount,
        total: l.total,
      })),
      totals: {
        subtotal: command.subtotal,
        taxRate: command.tax_rate,
        taxAmount: command.tax_amount,
        discountAmount: command.discount_amount,
        deliveryFee: command.delivery_fee,
        damageCharges: command.damage_charges,
        total: command.total,
      },
    });

    // 2. Create Domain Entity
    const invoice = Invoice.create({
      id_reservation: command.id_reservation,
      id_customer: command.id_customer,
      id_currency: command.id_currency,
      invoice_number: invoiceNumber,
      issue_date: command.issue_date,
      amount: {
        subtotal: command.subtotal,
        taxRate: command.tax_rate,
        taxAmount: command.tax_amount,
        discountAmount: command.discount_amount,
        deliveryFee: command.delivery_fee,
        damageCharges: command.damage_charges,
        total: command.total,
      },
      status: command.status,
      due_date: command.due_date,
      notes: command.notes,
      fiscal_provider: result.fiscalProvider,
      fiscal_id: result.fiscalId,
      fiscal_status: result.fiscalStatus,
      fiscal_response: result.fiscalResponse,
      pdf_path: result.pdfPath,
      id_created_by: command.id_created_by,
      lines: command.lines.map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unit_price: l.unit_price,
        subtotal: l.subtotal,
        tax_amount: l.tax_amount,
        total: l.total,
        id_product: l.id_product,
      })),
    });

    // 3. Save to repository
    return await this.repository.save(invoice);
  }
}
