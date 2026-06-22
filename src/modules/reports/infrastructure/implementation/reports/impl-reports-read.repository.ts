import { Injectable } from '@nestjs/common';
import { IReportsReadRepository, DashboardDateParams, DashboardRawData } from '../../../application/repositories/reports-read.repository';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class ImplReportsReadRepository implements IReportsReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueSummary(startDate: Date, endDate: Date): Promise<{ totalRevenue: number; totalInvoices: number }> {
    const invoices = await this.prisma.client.mnt_invoice.findMany({
      where: {
        issue_date: {
          gte: startDate,
          lte: endDate,
        },
        ctl_status: {
          code: {
            not: 'CANCELLED',
          },
        },
      },
      select: {
        total: true,
      },
    });

    const totalRevenue = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    return {
      totalRevenue,
      totalInvoices: invoices.length,
    };
  }

  async getDashboardSummaryData(dates: DashboardDateParams): Promise<DashboardRawData> {
    const { todayStart, todayEnd, weekStart, weekEnd, monthStart, monthEnd, tomorrowEnd } = dates;

    // Reservas (Confirmadas)
    const reservasHoy = await this.prisma.client.mnt_reservation.count({
      where: { event_start: { gte: todayStart, lte: todayEnd }, ctl_status: { code: 'CONFIRMED' } },
    });
    const reservasSemana = await this.prisma.client.mnt_reservation.count({
      where: { event_start: { gte: weekStart, lte: weekEnd }, ctl_status: { code: 'CONFIRMED' } },
    });
    const reservasMes = await this.prisma.client.mnt_reservation.count({
      where: { event_start: { gte: monthStart, lte: monthEnd }, ctl_status: { code: 'CONFIRMED' } },
    });

    // Ingresos
    const getRevenue = async (start: Date, end: Date) => {
      const result = await this.prisma.client.mnt_payment.aggregate({
        _sum: { amount: true },
        where: { payment_date: { gte: start, lte: end }, ctl_status: { code: 'COMPLETED' } }
      });
      return Number(result._sum.amount || 0);
    };
    const ingresosHoy = await getRevenue(todayStart, todayEnd);
    const ingresosSemana = await getRevenue(weekStart, weekEnd);
    const ingresosMes = await getRevenue(monthStart, monthEnd);

    // Logística
    const enProgreso = await this.prisma.client.mnt_reservation.count({
      where: { ctl_status: { code: 'IN_PROGRESS' } }
    });
    const finalizadas = await this.prisma.client.mnt_reservation.count({
      where: { ctl_status: { code: 'COMPLETED' } }
    });
    const enMantenimiento = await this.prisma.client.mnt_product_maintenance.count({
      where: { resolved: false }
    });

    // Cuentas por Cobrar
    const reservasCxc = await this.prisma.client.mnt_reservation.aggregate({
      _sum: { balance_due: true },
      where: { balance_due: { gt: 0 }, ctl_status: { code: { notIn: ['CANCELLED', 'PENDING'] } } }
    });
    const balancePendiente = Number(reservasCxc._sum.balance_due || 0);

    const facturasDraft = await this.prisma.client.mnt_invoice.count({
      where: { ctl_status: { code: 'PENDING' } }
    });

    // Top Productos
    const topItems = await this.prisma.client.mnt_reservation_item.groupBy({
      by: ['id_product'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 4,
    });
    
    const top_productos = [];
    for (const item of topItems) {
      const prod = await this.prisma.client.mnt_product.findUnique({ where: { id: item.id_product } });
      if (prod) {
        top_productos.push({
          nombre: prod.name,
          cantidad: item._sum.quantity || 0,
        });
      }
    }

    // Próximos Eventos (Hoy y Mañana)
    const eventosRawQuery = await this.prisma.client.mnt_reservation.findMany({
      where: { 
        event_start: { gte: todayStart, lte: tomorrowEnd },
        ctl_status: { code: { notIn: ['CANCELLED', 'PENDING'] } }
      },
      orderBy: { event_start: 'asc' },
      take: 5,
      include: { mnt_customer: true }
    });

    const eventosRaw = eventosRawQuery.map(ev => ({
      first_name: ev.mnt_customer.first_name,
      last_name: ev.mnt_customer.last_name,
      delivery_address: ev.delivery_address,
      event_start: ev.event_start,
    }));

    return {
      reservasHoy, reservasSemana, reservasMes,
      ingresosHoy, ingresosSemana, ingresosMes,
      enProgreso, finalizadas, enMantenimiento,
      balancePendiente, facturasDraft,
      top_productos,
      eventosRaw,
    };
  }
}
