import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { AvailabilityRepository } from '../../domain/repositories/availability.repository';

@Injectable()
export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

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

    const overlappingReservations =
      await this.prisma.client.mnt_reservation_item.aggregate({
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
    const available = await this.getAvailableStock(
      productId,
      dateStart,
      dateEnd,
    );
    return available >= quantity;
  }
}
