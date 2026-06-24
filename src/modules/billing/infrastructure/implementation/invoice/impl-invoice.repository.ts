import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '@/modules/billing/domain/repositories/invoice-repository';
import { InvoiceQueriesRepository } from '@/modules/billing/application/repositories/invoice-read.repository';
import { Invoice } from '@/modules/billing/domain/entities/invoice';
import { InvoiceId } from '@/modules/billing/domain/value-objects/invoice-value-object/invoice-id';
import {
  InvoiceDto,
  InvoiceLineDto,
} from '@/modules/billing/application/dtos/invoice.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';

@Injectable()
export class ImplInvoiceRepository
  implements InvoiceRepository, InvoiceQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(invoice: Invoice): Promise<Invoice> {
    try {
      const invoiceId = invoice.getId()?.value();

      const savedInvoice = await this.prisma.client.$transaction(
        async (prisma) => {
          const statusId = (
            await prisma.ctl_status.findFirstOrThrow({
              where: {
                code: invoice.getStatus().value(),
                ctl_category_status: { code: 'INV' },
              },
            })
          ).id;

          if (invoiceId) {
            // Update existing invoice
            const existing = await prisma.mnt_invoice.findUnique({
              where: { id: invoiceId },
            });

            if (!existing) {
              throw new Error(
                `Invoice with ID ${invoiceId} not found for update`,
              );
            }

            await prisma.mnt_invoice.update({
              where: { id: invoiceId },
              data: {
                id_reservation: invoice.getIdReservation().value(),
                id_customer: invoice.getIdCustomer().value(),
                id_currency: invoice.getIdCurrency().value(),
                invoice_number: invoice.getInvoiceNumber().value(),
                issue_date: invoice.getIssueDate().value(),
                due_date: invoice.getDueDate()?.value() ?? null,
                subtotal: invoice.getAmount().subtotal,
                tax_rate: invoice.getAmount().taxRate,
                tax_amount: invoice.getAmount().taxAmount,
                discount_amount: invoice.getAmount().discountAmount,
                delivery_fee: invoice.getAmount().deliveryFee,
                damage_charges: invoice.getAmount().damageCharges,
                total: invoice.getAmount().total,
                id_status: statusId,
                notes: invoice.getNotes()?.value() ?? null,
                fiscal_provider: invoice.getFiscalProvider()?.value() ?? null,
                fiscal_id: invoice.getFiscalId()?.value() ?? null,
                fiscal_status: invoice.getFiscalStatus()?.value() ?? null,
                fiscal_response: invoice.getFiscalResponse()?.value() ?? null,
                pdf_path: invoice.getPdfPath()?.value() ?? null,
                id_created_by: invoice.getIdCreatedBy()?.value() ?? null,
                updated_at: new Date(),
              },
            });

            // Delete existing lines and recreate them
            await prisma.mnt_invoice_line.deleteMany({
              where: { id_invoice: invoiceId },
            });

            const invoiceLines = invoice.getLines().map((line, index) => ({
              id_invoice: invoiceId,
              description: line.getDescription().value(),
              quantity: line.getQuantity().value(),
              unit_price: line.getUnitPrice().value(),
              subtotal: line.getSubtotal().value(),
              id_product: line.getIdProduct()?.value() ?? null,
              sort_order: index,
            }));

            if (invoiceLines.length > 0) {
              await prisma.mnt_invoice_line.createMany({
                data: invoiceLines,
              });
            }

            return await prisma.mnt_invoice.findUniqueOrThrow({
              where: { id: invoiceId },
              include: { mnt_invoice_line: true, ctl_status: true },
            });
          } else {
            // Create new invoice
            const createdInvoice = await prisma.mnt_invoice.create({
              data: {
                id_reservation: invoice.getIdReservation().value(),
                id_customer: invoice.getIdCustomer().value(),
                id_currency: invoice.getIdCurrency().value(),
                invoice_number: invoice.getInvoiceNumber().value(),
                issue_date: invoice.getIssueDate().value(),
                due_date: invoice.getDueDate()?.value() ?? null,
                subtotal: invoice.getAmount().subtotal,
                tax_rate: invoice.getAmount().taxRate,
                tax_amount: invoice.getAmount().taxAmount,
                discount_amount: invoice.getAmount().discountAmount,
                delivery_fee: invoice.getAmount().deliveryFee,
                damage_charges: invoice.getAmount().damageCharges,
                total: invoice.getAmount().total,
                id_status: statusId,
                notes: invoice.getNotes()?.value() ?? null,
                fiscal_provider: invoice.getFiscalProvider()?.value() ?? null,
                fiscal_id: invoice.getFiscalId()?.value() ?? null,
                fiscal_status: invoice.getFiscalStatus()?.value() ?? null,
                fiscal_response: invoice.getFiscalResponse()?.value() ?? null,
                pdf_path: invoice.getPdfPath()?.value() ?? null,
                id_created_by: invoice.getIdCreatedBy()?.value() ?? null,
                created_at: new Date(),
              },
            });

            const invoiceLines = invoice.getLines().map((line, index) => ({
              id_invoice: createdInvoice.id,
              description: line.getDescription().value(),
              quantity: line.getQuantity().value(),
              unit_price: line.getUnitPrice().value(),
              subtotal: line.getSubtotal().value(),
              id_product: line.getIdProduct()?.value() ?? null,
              sort_order: index,
            }));

            if (invoiceLines.length > 0) {
              await prisma.mnt_invoice_line.createMany({
                data: invoiceLines,
              });
            }

            return await prisma.mnt_invoice.findUniqueOrThrow({
              where: { id: createdInvoice.id },
              include: { mnt_invoice_line: true, ctl_status: true },
            });
          }
        },
      );

      return this.mapToDomain(savedInvoice);
    } catch (error: any) {
      console.log('DB ERROR INVOICE:', error);
      throw new DatabaseException('Error saving invoice', 'save');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter_reservation?: string,
    filter_customer?: string,
    filter_status?: string,
  ): Promise<Pagination<InvoiceDto> | InvoiceDto[]> {
    try {
      const where: any = {};

      if (filter_reservation) {
        where.id_reservation = filter_reservation;
      }
      if (filter_customer) {
        where.id_customer = filter_customer;
      }
      if (filter_status) {
        where.id_status = filter_status;
      }

      const [invoicesDb, total] = await Promise.all([
        this.prisma.client.mnt_invoice.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          include: {
            mnt_invoice_line: true,
            mnt_customer: true,
            ctl_status: true,
          },
          orderBy: { issue_date: 'desc' },
        }),
        this.prisma.client.mnt_invoice.count({ where }),
      ]);

      const invoices = invoicesDb.map((i: any) => this.mapToDto(i));

      if (!pagination_params) return invoices;

      const entityList =
        invoices.length > 0
          ? new EntityList<InvoiceDto>(invoices)
          : new EntityList<InvoiceDto>([]);

      return new Pagination<InvoiceDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      throw new DatabaseException('Error getting invoices', 'getAll');
    }
  }

  findById(id: string): Promise<InvoiceDto | null>;
  findById(id: InvoiceId): Promise<Invoice | null>;
  async findById(id: string | InvoiceId): Promise<InvoiceDto | Invoice | null> {
    try {
      const isDomainId = id instanceof InvoiceId;
      const idString = isDomainId ? id.value() : id;

      const invoice = await this.prisma.client.mnt_invoice.findUnique({
        where: { id: idString },
        include: {
          mnt_invoice_line: true,
          mnt_customer: true,
          ctl_status: true,
        },
      });
      if (!invoice) return null;

      if (isDomainId) {
        return this.mapToDomain(invoice);
      }
      return this.mapToDto(invoice as any);
    } catch (error) {
      throw new DatabaseException('Error finding invoice', 'findById');
    }
  }

  private mapToDomain(i: any): Invoice {
    return Invoice.create({
      id: i.id,
      id_reservation: i.id_reservation,
      id_customer: i.id_customer,
      id_currency: i.id_currency,
      invoice_number: i.invoice_number,
      issue_date: i.issue_date,
      amount: {
        subtotal: Number(i.subtotal),
        taxRate: Number(i.tax_rate),
        taxAmount: Number(i.tax_amount),
        discountAmount: Number(i.discount_amount),
        deliveryFee: Number(i.delivery_fee),
        damageCharges: Number(i.damage_charges),
        total: Number(i.total),
      },
      status: i.ctl_status.code,
      due_date: i.due_date ?? undefined,
      notes: i.notes ?? undefined,
      fiscal_provider: i.fiscal_provider ?? undefined,
      fiscal_id: i.fiscal_id ?? undefined,
      fiscal_status: i.fiscal_status ?? undefined,
      fiscal_response: i.fiscal_response ?? undefined,
      pdf_path: i.pdf_path ?? undefined,
      id_created_by: i.id_created_by ?? undefined,
      lines: i.mnt_invoice_line
        ? i.mnt_invoice_line.map((l: any) => ({
            id: l.id,
            description: l.description,
            quantity: l.quantity,
            unit_price: Number(l.unit_price),
            subtotal: Number(l.subtotal),
            tax_amount: 0,
            total: Number(l.subtotal),
            id_product: l.id_product ?? undefined,
          }))
        : [],
    });
  }

  private mapToDto(i: any): InvoiceDto {
    return new InvoiceDto(
      i.id_reservation,
      i.id_customer,
      i.id_currency,
      i.invoice_number,
      i.issue_date,
      Number(i.subtotal),
      Number(i.tax_rate),
      Number(i.tax_amount),
      Number(i.discount_amount),
      Number(i.delivery_fee),
      Number(i.damage_charges),
      Number(i.total),
      i.ctl_status,
      i.due_date ?? undefined,
      i.notes ?? undefined,
      i.fiscal_provider ?? undefined,
      i.fiscal_id ?? undefined,
      i.fiscal_status ?? undefined,
      i.fiscal_response ?? undefined,
      i.pdf_path ?? undefined,
      i.id_created_by ?? undefined,
      i.mnt_invoice_line
        ? i.mnt_invoice_line.map(
            (l: any) =>
              new InvoiceLineDto(
                l.description,
                l.quantity,
                Number(l.unit_price),
                Number(l.subtotal),
                0,
                Number(l.subtotal),
                l.id_product ?? undefined,
                l.id_invoice,
                l.id,
              ),
          )
        : [],
      i.id,
      i.created_at,
      i.updated_at,
      i.mnt_customer
        ? {
            first_name: i.mnt_customer.first_name,
            last_name: i.mnt_customer.last_name,
            email: i.mnt_customer.email,
            phone: i.mnt_customer.phone,
          }
        : undefined,
    );
  }
}
