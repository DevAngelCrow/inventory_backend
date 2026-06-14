import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationQueriesRepository } from '@/modules/reservations/application/repositories/reservation-read.repository';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';
import { ReservationStatusType } from '@/modules/reservations/domain/value-objects/reservation-status';
import { ReservationDto, ReservationItemDto } from '@/modules/reservations/application/dtos/reservation.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';

@Injectable()
export class ImplReservationRepository
  implements ReservationRepository, ReservationQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(reservation: Reservation): Promise<void> {
    try {
      await this.prisma.client.$transaction(async (prisma) => {
        const defaultCurrency = await prisma.ctl_currency.findFirst({
            where: { active: true },
        });
        const id_currency = defaultCurrency?.id || '00000000-0000-0000-0000-000000000000'; // Fallback if no currency found

        const createdReservation = await prisma.mnt_reservation.create({
          data: {
            reservation_number: `RES-${Date.now().toString().slice(-6)}`,
            id_customer: reservation.getIdCustomer(),
            id_currency: id_currency,
            status: reservation.getStatus().value(),
            event_start: reservation.getDateRange().start,
            event_end: reservation.getDateRange().end,
            delivery_address: reservation.getDeliveryAddress().value() ?? null,
            subtotal: reservation.getAmount().total,
            total: reservation.getAmount().total,
            deposit_amount: reservation.getAmount().deposit ?? 0,
            balance_due: reservation.getAmount().balance ?? reservation.getAmount().total,
            notes: reservation.getNotes().value() ?? null,
            created_at: new Date(),
          },
        });

        const itemsData = reservation.getItems().map((item) => ({
          id_reservation: createdReservation.id,
          id_product: item.getIdProduct(),
          quantity: item.getQuantity().value(),
          unit_price: item.getPrice().unitPrice,
          subtotal: item.getPrice().totalPrice,
          created_at: new Date(),
        }));

        if (itemsData.length > 0) {
          await prisma.mnt_reservation_item.createMany({
            data: itemsData,
          });
        }
      });
    } catch (error: any) {
      throw new DatabaseException('Error creating reservation', 'create');
    }
  }

  async updateStatus(id: ReservationId, status: ReservationStatusType): Promise<Reservation> {
    try {
      const existing = await this.prisma.client.mnt_reservation.findUnique({
        where: { id: id.value() },
        include: { mnt_reservation_item: true },
      });
      if (!existing) {
        throw new NotFoundException('Reservation', id.value());
      }
      const updated = await this.prisma.client.mnt_reservation.update({
        where: { id: id.value() },
        data: {
          status: status,
          updated_at: new Date(),
        },
        include: { mnt_reservation_item: true },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error updating reservation status', 'updateStatus');
    }
  }

  async delete(id: ReservationId): Promise<void> {
    try {
      const existing = await this.prisma.client.mnt_reservation.findUnique({
        where: { id: id.value() },
      });
      if (!existing) {
        throw new NotFoundException('Reservation', id.value());
      }
      await this.prisma.client.mnt_reservation.update({
        where: { id: id.value() },
        data: {
          deleted_at: new Date(),
          status: 'CANCELLED',
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error deleting reservation', 'delete');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter_customer?: string,
    filter_status?: string,
    filter_date_start?: Date,
    filter_date_end?: Date,
  ): Promise<Pagination<ReservationDto> | ReservationDto[]> {
    try {
      const where: any = {
        deleted_at: null,
      };

      if (filter_customer) {
        where.id_customer = filter_customer;
      }
      if (filter_status) {
        where.status = filter_status;
      }
      if (filter_date_start) {
        where.event_start = { gte: filter_date_start };
      }
      if (filter_date_end) {
        where.event_end = { lte: filter_date_end };
      }

      const [reservationsDb, total] = await Promise.all([
        this.prisma.client.mnt_reservation.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          include: { mnt_reservation_item: true },
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.client.mnt_reservation.count({ where }),
      ]);

      const reservations = reservationsDb.map((r: any) => this.mapToDto(r));

      if (!pagination_params) return reservations;

      const entityList =
        reservations.length > 0
          ? new EntityList<ReservationDto>(reservations)
          : new EntityList<ReservationDto>([]);

      return new Pagination<ReservationDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(Math.ceil(total / pagination_params.getPerPage().value())),
      );
    } catch (error) {
      throw new DatabaseException('Error getting reservations', 'getAll');
    }
  }

  async findById(id: string): Promise<ReservationDto | null> {
    try {
      const reservation = await this.prisma.client.mnt_reservation.findUnique({
        where: { id },
        include: { mnt_reservation_item: true },
      });
      if (!reservation) return null;
      return this.mapToDto(reservation as any);
    } catch (error) {
      throw new DatabaseException('Error finding reservation', 'findById');
    }
  }

  private mapToDomain(r: any): Reservation {
    return Reservation.create({
      id: r.id,
      id_customer: r.id_customer,
      status: r.status,
      event_start: r.event_start,
      event_end: r.event_end,
      delivery_address: r.delivery_address ?? undefined,
      total_amount: Number(r.total),
      deposit_amount: r.deposit_amount ? Number(r.deposit_amount) : undefined,
      balance_due: r.balance_due ? Number(r.balance_due) : undefined,
      notes: r.notes ?? undefined,
      items: r.mnt_reservation_item ? r.mnt_reservation_item.map((i: any) => ({
        id: i.id,
        id_product: i.id_product,
        quantity: i.quantity,
        unit_price: Number(i.unit_price),
        total_price: Number(i.subtotal),
      })) : [],
    });
  }

  private mapToDto(r: any): ReservationDto {
    return new ReservationDto(
      r.id_customer,
      r.status,
      r.event_start,
      r.event_end,
      Number(r.total),
      r.delivery_address ?? undefined,
      r.deposit_amount ? Number(r.deposit_amount) : undefined,
      r.balance_due ? Number(r.balance_due) : undefined,
      r.notes ?? undefined,
      r.mnt_reservation_item ? r.mnt_reservation_item.map((i: any) => new ReservationItemDto(
        i.id_product,
        i.quantity,
        Number(i.unit_price),
        Number(i.subtotal),
        i.id_reservation,
        i.id,
      )) : [],
      r.id,
      r.created_at,
      r.updated_at,
    );
  }
}
