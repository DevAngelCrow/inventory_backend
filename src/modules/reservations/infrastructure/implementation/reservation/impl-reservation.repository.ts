import { Injectable } from '@nestjs/common';
import { Prisma, mnt_reservation } from 'generated/prisma/client';

type ReservationModel = Prisma.mnt_reservationGetPayload<{
  include: {
    mnt_reservation_item: { include: { mnt_product: true } };
    mnt_customer: {
      include: {
        mnt_customer_address: {
          include: {
            ctl_geographic_division: true;
          };
        };
      };
    };
    ctl_status: true;
    ctl_geographic_division: true;
    mnt_invoice: { include: { ctl_status: true } };
  };
}>;

type ReservationItemModel = ReservationModel['mnt_reservation_item'][number];
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationQueriesRepository } from '@/modules/reservations/application/repositories/reservation-read.repository';
import { ReservationAggregate as Reservation } from '@/modules/reservations/domain/aggregates/reservation.aggregate';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';
import { ReservationStatusType } from '@/modules/reservations/domain/value-objects/reservation-status';
import {
  ReservationDto,
  ReservationItemDto,
} from '@/modules/reservations/application/dtos/reservation.dto';
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
      const defaultCurrency = await this.prisma.client.ctl_currency.findFirst({
        where: { active: true },
      });
      const id_currency =
        defaultCurrency?.id || '00000000-0000-0000-0000-000000000000'; // Fallback if no currency found

      const createdReservation =
        await this.prisma.client.mnt_reservation.create({
          data: {
            id: reservation.getId()?.value(),
            reservation_number: `RES-${Date.now().toString().slice(-6)}`,
            id_customer: reservation.getIdCustomer().value(),
            id_currency: id_currency,
            id_status: (
              await this.prisma.client.ctl_status.findFirstOrThrow({
                where: {
                  code: reservation.getStatus().value(),
                  ctl_category_status: { code: 'RES' },
                },
              })
            ).id,
            event_start: reservation.getDateRange().start,
            event_end: reservation.getDateRange().end,
            delivery_address:
              reservation.getDeliveryAddress().addressLine1 ?? null,
            delivery_address_line2:
              reservation.getDeliveryAddress().addressLine2 ?? null,
            delivery_zip: reservation.getDeliveryAddress().zip ?? null,
            delivery_notes: reservation.getDeliveryAddress().notes ?? null,
            id_customer_address:
              reservation.getDeliveryAddress().idCustomerAddress ?? null,
            id_geographic_division:
              reservation.getDeliveryAddress().idGeographicDivision ?? null,
            subtotal: reservation.getAmount().total,
            total: reservation.getAmount().total,
            deposit_amount: reservation.getAmount().deposit ?? 0,
            balance_due:
              reservation.getAmount().balance ?? reservation.getAmount().total,
            delivery_fee: reservation.getAmount().deliveryFee,
            discount_amount: reservation.getAmount().discountAmount,
            notes: reservation.getNotes().value() ?? null,
            created_at: new Date(),
          },
        });

      const itemsData = reservation.getItems().map((item) => ({
        id_reservation: createdReservation.id,
        id_product: item.getIdProduct().value(),
        quantity: item.getQuantity().value(),
        unit_price: item.getPrice().unitPrice,
        subtotal: item.getPrice().totalPrice,
        created_at: new Date(),
      }));

      if (itemsData.length > 0) {
        await this.prisma.client.mnt_reservation_item.createMany({
          data: itemsData,
        });
      }
    } catch (error) {
      throw new DatabaseException(
        `Error creating reservation: ${error instanceof Error ? error.message : String(error)}`,
        'create',
      );
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
      throw new DatabaseException(
        'Error updating reservation balance',
        'updateBalance',
      );
    }
  }

  async update(reservation: Reservation): Promise<void> {
    try {
      const reservationId = reservation.getId()?.value();
      if (!reservationId)
        throw new Error('Reservation ID is required for update');

      const existing = await this.prisma.client.mnt_reservation.findUnique({
        where: { id: reservationId },
      });
      if (!existing) {
        throw new NotFoundException('Reservation', reservationId);
      }

      await this.prisma.client.mnt_reservation.update({
        where: { id: reservationId },
        data: {
          id_customer: reservation.getIdCustomer().value(),
          id_status: (
            await this.prisma.client.ctl_status.findFirstOrThrow({
              where: {
                code: reservation.getStatus().value(),
                ctl_category_status: { code: 'RES' },
              },
            })
          ).id,
          event_start: reservation.getDateRange().start,
          event_end: reservation.getDateRange().end,
          delivery_address:
            reservation.getDeliveryAddress().addressLine1 ?? null,
          delivery_address_line2:
            reservation.getDeliveryAddress().addressLine2 ?? null,
          delivery_zip: reservation.getDeliveryAddress().zip ?? null,
          delivery_notes: reservation.getDeliveryAddress().notes ?? null,
          id_customer_address:
            reservation.getDeliveryAddress().idCustomerAddress ?? null,
          id_geographic_division:
            reservation.getDeliveryAddress().idGeographicDivision ?? null,
          subtotal: reservation.getAmount().total,
          total: reservation.getAmount().total,
          deposit_amount: reservation.getAmount().deposit ?? 0,
          balance_due:
            reservation.getAmount().balance ?? reservation.getAmount().total,
          delivery_fee: reservation.getAmount().deliveryFee,
          discount_amount: reservation.getAmount().discountAmount,
          notes: reservation.getNotes().value() ?? null,
          updated_at: new Date(),
        },
      });

      // Delete existing items and recreate them
      await this.prisma.client.mnt_reservation_item.deleteMany({
        where: { id_reservation: reservationId },
      });

      const itemsData = reservation.getItems().map((item) => ({
        id_reservation: reservationId,
        id_product: item.getIdProduct().value(),
        quantity: item.getQuantity().value(),
        unit_price: item.getPrice().unitPrice,
        subtotal: item.getPrice().totalPrice,
        created_at: existing.created_at, // Preserve original created_at if needed, or use new Date()
      }));

      if (itemsData.length > 0) {
        await this.prisma.client.mnt_reservation_item.createMany({
          data: itemsData,
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error updating reservation', 'update');
    }
  }

  async updateStatus(
    id: ReservationId,
    status: ReservationStatusType,
    deliveryDatetime?: Date,
    pickupDatetime?: Date,
  ): Promise<Reservation> {
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
          id_status: (
            await this.prisma.client.ctl_status.findFirstOrThrow({
              where: { code: status, ctl_category_status: { code: 'RES' } },
            })
          ).id,
          updated_at: new Date(),
          ...(deliveryDatetime ? { delivery_datetime: deliveryDatetime } : {}),
          ...(pickupDatetime ? { pickup_datetime: pickupDatetime } : {}),
        },
        include: {
          mnt_reservation_item: { include: { mnt_product: true } },
          mnt_customer: {
            include: {
              mnt_customer_address: {
                where: { is_primary: true },
                include: { ctl_geographic_division: true },
              },
            },
          },
          ctl_status: true,
          ctl_geographic_division: true,
          mnt_invoice: { include: { ctl_status: true } },
        },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException(
        'Error updating reservation status',
        'updateStatus',
      );
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
          id_status: (
            await this.prisma.client.ctl_status.findFirstOrThrow({
              where: {
                code: 'CANCELLED',
                ctl_category_status: { code: 'RES' },
              },
            })
          ).id,
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
      const where: Prisma.mnt_reservationWhereInput = {
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
            mnt_customer: {
              include: {
                mnt_customer_address: {
                  where: { is_primary: true },
                  include: { ctl_geographic_division: true },
                },
              },
            },
            ctl_status: true,
            ctl_geographic_division: true,
            mnt_invoice: { include: { ctl_status: true } },
          },
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.client.mnt_reservation.count({ where }),
      ]);

      const divisionIds = reservationsDb.flatMap((r) => [
        r.ctl_geographic_division?.id,
        r.mnt_customer?.mnt_customer_address?.[0]?.ctl_geographic_division?.id,
      ]);
      const geoPaths = await this.getGeoPathsForDivisions(divisionIds);

      const reservations = reservationsDb.map((r) =>
        this.mapToDto(r, geoPaths),
      );

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
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      console.log(error, 'Error getting reservations');
      throw new DatabaseException('Error getting reservations', 'getAll');
    }
  }

  async findById(id: string): Promise<ReservationDto | null> {
    try {
      const reservation = await this.prisma.client.mnt_reservation.findUnique({
        where: { id },
        include: {
          mnt_reservation_item: { include: { mnt_product: true } },
          mnt_customer: {
            include: {
              mnt_customer_address: {
                where: { is_primary: true },
                include: { ctl_geographic_division: true },
              },
            },
          },
          ctl_status: true,
          ctl_geographic_division: true,
          mnt_invoice: { include: { ctl_status: true } },
        },
      });
      if (!reservation) return null;

      const geoPaths = await this.getGeoPathsForDivisions([
        reservation.ctl_geographic_division?.id,
        reservation.mnt_customer?.mnt_customer_address?.[0]
          ?.ctl_geographic_division?.id,
      ]);

      return this.mapToDto(reservation, geoPaths);
    } catch (error) {
      throw new DatabaseException('Error finding reservation', 'findById');
    }
  }

  private async getGeoPathsForDivisions(
    divisionIds: (string | undefined | null)[],
  ): Promise<Map<string, string>> {
    const uniqueIds = Array.from(
      new Set(divisionIds.filter((id): id is string => !!id)),
    );
    if (uniqueIds.length === 0) return new Map();

    const query = Prisma.sql`
      WITH RECURSIVE GeoPath AS (
        SELECT id, name, id_parent, id as root_id, 1 as depth
        FROM ctl_geographic_division
        WHERE id = ANY(ARRAY[${Prisma.join(uniqueIds)}]::uuid[])
        
        UNION ALL
        
        SELECT p.id, p.name, p.id_parent, gp.root_id, gp.depth + 1
        FROM ctl_geographic_division p
        INNER JOIN GeoPath gp ON gp.id_parent = p.id
      )
      SELECT root_id, name, depth
      FROM GeoPath
      ORDER BY root_id, depth ASC;
    `;

    const results =
      await this.prisma.client.$queryRaw<
        { root_id: string; name: string; depth: number }[]
      >(query);

    const map = new Map<string, string>();
    const grouped = new Map<string, string[]>();

    for (const row of results) {
      if (!grouped.has(row.root_id)) {
        grouped.set(row.root_id, []);
      }
      grouped.get(row.root_id)!.push(row.name);
    }

    for (const [rootId, names] of grouped.entries()) {
      map.set(rootId, names.join(', '));
    }

    return map;
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

  private mapToDomain(r: ReservationModel): Reservation {
    return Reservation.create({
      id: r.id,
      id_customer: r.id_customer,
      status: r.ctl_status?.code,
      event_start: r.event_start,
      event_end: r.event_end,
      delivery_address: r.delivery_address as any,
      delivery_address_line2: r.delivery_address_line2 ?? undefined,
      delivery_zip: r.delivery_zip ?? undefined,
      delivery_notes: r.delivery_notes ?? undefined,
      id_customer_address: r.id_customer_address ?? undefined,
      id_geographic_division: r.id_geographic_division ?? undefined,
      total_amount: Number(r.total),
      deposit_amount: r.deposit_amount ? Number(r.deposit_amount) : undefined,
      balance_due: r.balance_due ? Number(r.balance_due) : undefined,
      delivery_fee: r.delivery_fee ? Number(r.delivery_fee) : undefined,
      discount_amount: r.discount_amount
        ? Number(r.discount_amount)
        : undefined,
      notes: r.notes ?? undefined,
      items: r.mnt_reservation_item
        ? r.mnt_reservation_item.map((i: ReservationItemModel) => ({
            id: i.id,
            id_product: i.id_product,
            quantity: i.quantity,
            unit_price: Number(i.unit_price),
            total_price: Number(i.subtotal),
          }))
        : [],
      delivery_datetime: r.delivery_datetime ?? undefined,
      pickup_datetime: r.pickup_datetime ?? undefined,
    });
  }

  private mapToDto(
    r: ReservationModel,
    geoPaths: Map<string, string>,
  ): ReservationDto {
    return new ReservationDto(
      r.id_customer,
      r.ctl_status,
      r.event_start,
      r.event_end,
      Number(r.total),
      r.delivery_address ?? undefined,
      r.delivery_address_line2 ?? undefined,
      r.delivery_zip ?? undefined,
      r.delivery_notes ?? undefined,
      r.id_customer_address ?? undefined,
      r.id_geographic_division ?? undefined,
      (r.ctl_geographic_division?.id
        ? geoPaths.get(r.ctl_geographic_division.id)
        : undefined) ??
        r.ctl_geographic_division?.name ??
        undefined,
      r.deposit_amount ? Number(r.deposit_amount) : undefined,
      r.balance_due ? Number(r.balance_due) : undefined,
      r.delivery_fee ? Number(r.delivery_fee) : undefined,
      r.discount_amount ? Number(r.discount_amount) : undefined,
      r.notes ?? undefined,
      r.mnt_reservation_item
        ? r.mnt_reservation_item.map(
            (i: ReservationItemModel) =>
              new ReservationItemDto(
                i.id_product,
                i.quantity,
                Number(i.unit_price),
                Number(i.subtotal),
                i.id_reservation,
                i.id,
                i.mnt_product
                  ? { name: i.mnt_product.name, sku: i.mnt_product.sku }
                  : undefined,
              ),
          )
        : [],
      r.id,
      r.created_at,
      r.updated_at,
      r.reservation_number,
      r.delivery_datetime,
      r.pickup_datetime,
      r.transit_time_minutes,
      r.mnt_customer
        ? {
            first_name: r.mnt_customer.first_name,
            last_name: r.mnt_customer.last_name,
            email: r.mnt_customer.email,
            phone: r.mnt_customer.phone,
            full_address:
              r.mnt_customer.mnt_customer_address &&
              r.mnt_customer.mnt_customer_address.length > 0
                ? [
                    r.mnt_customer.mnt_customer_address[0].address_line1,
                    r.mnt_customer.mnt_customer_address[0].address_line2,
                    r.mnt_customer.mnt_customer_address[0]
                      .ctl_geographic_division?.id
                      ? geoPaths.get(
                          r.mnt_customer.mnt_customer_address[0]
                            .ctl_geographic_division.id,
                        )
                      : r.mnt_customer.mnt_customer_address[0]
                          .ctl_geographic_division?.name,
                  ]
                    .filter(Boolean)
                    .join(', ')
                : undefined,
          }
        : undefined,
      r.mnt_invoice,
    );
  }
}
