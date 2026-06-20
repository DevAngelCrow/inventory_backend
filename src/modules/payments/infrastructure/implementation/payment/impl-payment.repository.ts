import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@/modules/payments/domain/repositories/payment-repository';
import { PaymentQueriesRepository } from '@/modules/payments/application/repositories/payment-read.repository';
import { Payment } from '@/modules/payments/domain/entities/payment';
import { PaymentDto } from '@/modules/payments/application/dtos/payment.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';

@Injectable()
export class ImplPaymentRepository
  implements PaymentRepository, PaymentQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(payment: Payment): Promise<Payment> {
    try {
      let savedPayment;
      if (payment.getId()) {
        savedPayment = await this.prisma.client.mnt_payment.update({
          where: { id: payment.getId()?.value() },
          data: {
            id_status: (await this.prisma.client.ctl_status.findFirstOrThrow({ where: { code: payment.getStatus().value(), ctl_category_status: { code: 'PAY' } } })).id,
            notes: payment.getNotes() ?? null,
            // Assuming we only really update status and notes when voiding
          },
        });
      } else {
        savedPayment = await this.prisma.client.mnt_payment.create({
          data: {
            id_reservation: payment.getIdReservation(),
            id_payment_method: payment.getIdPaymentMethod().value(),
            payment_number: `PAY-${Date.now().toString().slice(-6)}`,
            amount: payment.getAmount().value(),
            payment_date: payment.getPaymentDate().value(),
            reference_number: payment.getReferenceNumber() ?? null,
            notes: payment.getNotes() ?? null,
            id_status: (await this.prisma.client.ctl_status.findFirstOrThrow({ where: { code: payment.getStatus().value(), ctl_category_status: { code: 'PAY' } } })).id,
            gateway_provider: payment.getGatewayProvider() ?? null,
            gateway_tx_id: payment.getGatewayTxId() ?? null,
            gateway_response: payment.getGatewayResponse() ?? null,
            id_received_by: payment.getIdReceivedBy() ?? null,
            created_at: new Date(),
          },
        });
      }
      return this.mapToDomain(await this.prisma.client.mnt_payment.findUniqueOrThrow({ where: { id: savedPayment.id }, include: { ctl_status: true } }));
    } catch (error: any) {
      throw new DatabaseException('Error saving payment', 'save');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter_reservation?: string,
    filter_status?: string,
  ): Promise<Pagination<PaymentDto> | PaymentDto[]> {
    try {
      const where: any = {};

      if (filter_reservation) {
        where.id_reservation = filter_reservation;
      }
      if (filter_status) {
        where.id_status = filter_status;
      }

      const [paymentsDb, total] = await Promise.all([
        this.prisma.client.mnt_payment.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          include: { ctl_status: true },
          orderBy: { payment_date: 'desc' },
        }),
        this.prisma.client.mnt_payment.count({ where }),
      ]);

      const payments = paymentsDb.map((p: any) => this.mapToDto(p));

      if (!pagination_params) return payments;

      const entityList =
        payments.length > 0
          ? new EntityList<PaymentDto>(payments)
          : new EntityList<PaymentDto>([]);

      return new Pagination<PaymentDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(Math.ceil(total / pagination_params.getPerPage().value())),
      );
    } catch (error) {
      throw new DatabaseException('Error getting payments', 'getAll');
    }
  }

  async findById(id: string): Promise<PaymentDto | null> {
    try {
      const payment = await this.prisma.client.mnt_payment.findUnique({
        where: { id },
        include: { ctl_status: true },
      });
      if (!payment) return null;
      return this.mapToDto(payment as any);
    } catch (error) {
      throw new DatabaseException('Error finding payment', 'findById');
    }
  }

  async getMethods(): Promise<any[]> {
    try {
      return await this.prisma.client.ctl_payment_method.findMany({
        where: { active: true },
      });
    } catch (error) {
      throw new DatabaseException('Error getting payment methods', 'getMethods');
    }
  }

  private mapToDomain(p: any): Payment {
    return Payment.create({
      id: p.id,
      id_reservation: p.id_reservation,
      id_payment_method: p.id_payment_method,
      amount: Number(p.amount),
      payment_date: p.payment_date,
      status: p.ctl_status?.code ?? p.status,
      reference_number: p.reference_number ?? undefined,
      notes: p.notes ?? undefined,
      gateway_provider: p.gateway_provider ?? undefined,
      gateway_tx_id: p.gateway_tx_id ?? undefined,
      gateway_response: p.gateway_response ?? undefined,
      id_received_by: p.id_received_by ?? undefined,
    });
  }

  private mapToDto(p: any): PaymentDto {
    return new PaymentDto(
      p.id_reservation,
      p.id_payment_method,
      Number(p.amount),
      p.payment_date,
      p.ctl_status ?? p.status,
      p.payment_number,
      p.reference_number ?? undefined,
      p.notes ?? undefined,
      p.gateway_provider ?? undefined,
      p.gateway_tx_id ?? undefined,
      p.gateway_response ?? undefined,
      p.id_received_by ?? undefined,
      p.id,
      p.created_at,
      p.updated_at,
    );
  }
}
