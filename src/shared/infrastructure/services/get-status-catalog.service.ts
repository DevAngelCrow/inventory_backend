import {
  CategoryStatus,
  BooleanStatus,
} from '../../domain/enums/boolean-status';
import { BooleanStatusData } from '../interfaces/boolean-status-data.interface';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';
import { PrismaService } from '../persistence/prisma/prisma.service';
export class GetBooleanStatusCatalogService {
  static async getStatus(tx: TransactionClient | PrismaService) {
    const statuses = await tx.ctl_status.findMany({
      where: {
        ctl_category_status: {
          name: CategoryStatus.NAME,
          code: CategoryStatus.CODE,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        active: true,
        state_color: true,
        text_color: true,
        id_category_status: true,
        ctl_category_status: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            active: true,
          },
        },
      },
    });

    const mapStatus = new Map<string, BooleanStatusData>();
    statuses.forEach((status) => {
      const key = status.code.toLocaleLowerCase().toString();
      if (
        status.code.toLowerCase() === BooleanStatus.ACTIVE.toLowerCase() ||
        status.code.toLowerCase() === BooleanStatus.INACTIVE.toLowerCase()
      ) {
        mapStatus.set(key, status);
      }
    });
    return mapStatus;
  }
}
