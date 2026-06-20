import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checks if a product has enough available stock for a given date range.
   * This is a simplified check that subtracts the total quantity of items
   * reserved in overlapping date ranges from the total stock of the product.
   */
  async getAvailableStock(
    productId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    const product = await this.prisma.client.mnt_product.findUnique({
      where: { id: productId },
      select: { total_stock: true, active: true },
    });

    if (!product || !product.active) {
      return 0;
    }

    // Find all reservations that overlap with the requested date range
    // and include this product in their items.
    // Overlap condition:
    // reservation.event_start < dateEnd AND reservation.event_end > dateStart
    // and status is not cancelled.
    const overlappingReservations = await this.prisma.client.mnt_reservation_item.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        id_product: productId,
        mnt_reservation: {
          ctl_status: {
            code: {
              notIn: ['CANCELLED', 'RETURNED'],
            },
          },
          event_start: {
            lt: dateEnd,
          },
          event_end: {
            gt: dateStart,
          },
        },
      },
    });

    const reservedQuantity = overlappingReservations._sum?.quantity || 0;
    const availableStock = product.total_stock - reservedQuantity;

    return Math.max(0, availableStock);
  }

  async isAvailable(
    productId: string,
    quantity: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<boolean> {
    const available = await this.getAvailableStock(productId, dateStart, dateEnd);
    return available >= quantity;
  }
}
