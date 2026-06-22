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
            id_status: (await prisma.ctl_status.findFirstOrThrow({ where: { code: reservation.getStatus().value(), ctl_category_status: { code: 'RES' } } })).id,
            event_start: reservation.getDateRange().start,
            event_end: reservation.getDateRange().end,
            delivery_address: reservation.getDeliveryAddress().addressLine1 ?? null,
            delivery_address_line2: reservation.getDeliveryAddress().addressLine2 ?? null,
            delivery_zip: reservation.getDeliveryAddress().zip ?? null,
            delivery_notes: reservation.getDeliveryAddress().notes ?? null,
            id_customer_address: reservation.getDeliveryAddress().idCustomerAddress ?? null,
            id_geographic_division: reservation.getDeliveryAddress().idGeographicDivision ?? null,
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
      console.error('DATABASE ERROR (create reservation):', error);
      throw new DatabaseException(`Error creating reservation: ${error.message || error}`, 'create');
    }
  }

  async updateBalance(
    id: ReservationId,
    balance_due_delta: number,
    deposit_amount_delta: number,
  ): Promise<void> {
    try {
      await this.prisma.client.mnt_reservation.update({
        where: { id: id.value() },
        data: {
          balance_due: { increment: balance_due_delta },
          deposit_amount: { increment: deposit_amount_delta },
        },
      });
    } catch (error) {
      throw new DatabaseException('Error updating reservation balance', 'updateBalance');
    }
  }

  async update(reservation: Reservation): Promise<void> {
    try {
      const reservationId = reservation.getId()?.value();
      if (!reservationId) throw new Error('Reservation ID is required for update');

      await this.prisma.client.$transaction(async (prisma) => {
        const existing = await prisma.mnt_reservation.findUnique({
          where: { id: reservationId },
        });
        if (!existing) {
          throw new NotFoundException('Reservation', reservationId);
        }

        await prisma.mnt_reservation.update({
          where: { id: reservationId },
          data: {
            id_customer: reservation.getIdCustomer(),
            id_status: (await prisma.ctl_status.findFirstOrThrow({ where: { code: reservation.getStatus().value(), ctl_category_status: { code: 'RES' } } })).id,
            event_start: reservation.getDateRange().start,
            event_end: reservation.getDateRange().end,
            delivery_address: reservation.getDeliveryAddress().addressLine1 ?? null,
            delivery_address_line2: reservation.getDeliveryAddress().addressLine2 ?? null,
            delivery_zip: reservation.getDeliveryAddress().zip ?? null,
            delivery_notes: reservation.getDeliveryAddress().notes ?? null,
            id_customer_address: reservation.getDeliveryAddress().idCustomerAddress ?? null,
            id_geographic_division: reservation.getDeliveryAddress().idGeographicDivision ?? null,
            subtotal: reservation.getAmount().total,
            total: reservation.getAmount().total,
            deposit_amount: reservation.getAmount().deposit ?? 0,
            balance_due: reservation.getAmount().balance ?? reservation.getAmount().total,
            notes: reservation.getNotes().value() ?? null,
            updated_at: new Date(),
          },
        });

        // Delete existing items and recreate them
        await prisma.mnt_reservation_item.deleteMany({
          where: { id_reservation: reservationId },
        });

        const itemsData = reservation.getItems().map((item) => ({
          id_reservation: reservationId,
          id_product: item.getIdProduct(),
          quantity: item.getQuantity().value(),
          unit_price: item.getPrice().unitPrice,
          subtotal: item.getPrice().totalPrice,
          created_at: existing.created_at, // Preserve original created_at if needed, or use new Date()
        }));

        if (itemsData.length > 0) {
          await prisma.mnt_reservation_item.createMany({
            data: itemsData,
          });
        }
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error updating reservation', 'update');
    }
  }

  async updateStatus(id: ReservationId, status: ReservationStatusType, deliveryDatetime?: Date, pickupDatetime?: Date): Promise<Reservation> {
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
          id_status: (await this.prisma.client.ctl_status.findFirstOrThrow({ where: { code: status, ctl_category_status: { code: 'RES' } } })).id,
          updated_at: new Date(),
          ...(deliveryDatetime ? { delivery_datetime: deliveryDatetime } : {}),
          ...(pickupDatetime ? { pickup_datetime: pickupDatetime } : {}),
        },
        include: { mnt_reservation_item: true, ctl_status: true },
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
          id_status: (await this.prisma.client.ctl_status.findFirstOrThrow({ where: { code: 'CANCELLED', ctl_category_status: { code: 'RES' } } })).id,
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
        where.id_status = filter_status;
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
          include: { 
            mnt_reservation_item: { include: { mnt_product: true } },
            mnt_customer: true,
            ctl_status: true,
            ctl_geographic_division: true,
          },
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
        include: { 
          mnt_reservation_item: { include: { mnt_product: true } },
          mnt_customer: true,
          ctl_status: true,
          ctl_geographic_division: true,
        },
      });
      if (!reservation) return null;
      return this.mapToDto(reservation as any);
    } catch (error) {
      throw new DatabaseException('Error finding reservation', 'findById');
    }
  }

  async getDefaultCurrencyId(): Promise<string> {
    try {
      const defaultCurrency = await this.prisma.client.ctl_currency.findFirst({
          where: { active: true },
      });
      return defaultCurrency?.id || '00000000-0000-0000-0000-000000000000';
    } catch (e) {
      return '00000000-0000-0000-0000-000000000000';
    }
  }

  private mapToDomain(r: any): Reservation {
    return Reservation.create({
      id: r.id,
      id_customer: r.id_customer,
      status: r.ctl_status?.code ?? r.status,
      event_start: r.event_start,
      event_end: r.event_end,
      delivery_address: r.delivery_address ?? undefined,
      delivery_address_line2: r.delivery_address_line2 ?? undefined,
      delivery_zip: r.delivery_zip ?? undefined,
      delivery_notes: r.delivery_notes ?? undefined,
      id_customer_address: r.id_customer_address ?? undefined,
      id_geographic_division: r.id_geographic_division ?? undefined,
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
      delivery_datetime: r.delivery_datetime ?? undefined,
      pickup_datetime: r.pickup_datetime ?? undefined,
    });
  }

  private mapToDto(r: any): ReservationDto {
    return new ReservationDto(
      r.id_customer,
      r.ctl_status ?? r.status,
      r.event_start,
      r.event_end,
      Number(r.total),
      r.delivery_address ?? undefined,
      r.delivery_address_line2 ?? undefined,
      r.delivery_zip ?? undefined,
      r.delivery_notes ?? undefined,
      r.id_customer_address ?? undefined,
      r.id_geographic_division ?? undefined,
      r.ctl_geographic_division?.name ?? undefined,
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
        i.mnt_product ? { name: i.mnt_product.name, sku: i.mnt_product.sku } : undefined,
      )) : [],
      r.id,
      r.created_at,
      r.updated_at,
      r.reservation_number,
      r.delivery_datetime,
      r.pickup_datetime,
      r.transit_time_minutes,
      r.mnt_customer ? {
        first_name: r.mnt_customer.first_name,
        last_name: r.mnt_customer.last_name,
        email: r.mnt_customer.email,
        phone: r.mnt_customer.phone,
      } : undefined,
    );
  }
}
