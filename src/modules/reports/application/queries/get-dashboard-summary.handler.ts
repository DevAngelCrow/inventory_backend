import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDashboardSummaryQuery } from './get-dashboard-summary.query';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DashboardSummaryHttpDto } from '../../infrastructure/dtos/http/dashboard-summary-http.dto';
import { DateService } from '@/shared/application/services/date.service';

@QueryHandler(GetDashboardSummaryQuery)
export class GetDashboardSummaryHandler implements IQueryHandler<GetDashboardSummaryQuery> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateService: DateService,
  ) {}

  async execute(query: GetDashboardSummaryQuery): Promise<DashboardSummaryHttpDto> {
    const todayStart = this.dateService.getStartOf('day');
    const todayEnd = this.dateService.getEndOf('day');
    const weekStart = this.dateService.getStartOf('week');
    const weekEnd = this.dateService.getEndOf('week');
    const monthStart = this.dateService.getStartOf('month');
    const monthEnd = this.dateService.getEndOf('month');
    const tomorrowEnd = this.dateService.getEndOfDayWithOffset(1);

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
    const enTransito = await this.prisma.client.mnt_reservation.count({
      where: { ctl_status: { code: 'IN_TRANSIT' } }
    });
    const entregados = await this.prisma.client.mnt_reservation.count({
      where: { ctl_status: { code: 'DELIVERED' } }
    });
    const enMantenimiento = await this.prisma.client.mnt_product_maintenance.count({
      where: { resolved: false }
    });

    // Cuentas por Cobrar
    const reservasCxc = await this.prisma.client.mnt_reservation.aggregate({
      _sum: { balance_due: true },
      where: { balance_due: { gt: 0 }, ctl_status: { code: { notIn: ['CANCELLED', 'DRAFT'] } } }
    });
    const balancePendiente = Number(reservasCxc._sum.balance_due || 0);

    const facturasDraft = await this.prisma.client.mnt_invoice.count({
      where: { ctl_status: { code: 'DRAFT' } }
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
    const eventosRaw = await this.prisma.client.mnt_reservation.findMany({
      where: { 
        event_start: { gte: todayStart, lte: tomorrowEnd },
        ctl_status: { code: { notIn: ['CANCELLED', 'DRAFT'] } }
      },
      orderBy: { event_start: 'asc' },
      take: 5,
      include: { mnt_customer: true }
    });

    const proximos_eventos = eventosRaw.map(ev => ({
      cliente: `${ev.mnt_customer.first_name} ${ev.mnt_customer.last_name}`,
      direccion: ev.delivery_address || 'Recogida en tienda',
      fecha: this.dateService.format(ev.event_start, 'DD/MM/YYYY HH:mm'),
      tipo: ev.delivery_address ? 'ENTREGA' : 'RECOLECCION',
    }));

    return {
      reservas: { hoy: reservasHoy, semana: reservasSemana, mes: reservasMes },
      ingresos: { hoy: ingresosHoy, semana: ingresosSemana, mes: ingresosMes },
      logistica: { en_transito: enTransito, entregados: entregados, en_mantenimiento: enMantenimiento },
      cuentas_por_cobrar: { balance_pendiente: balancePendiente, facturas_draft: facturasDraft },
      top_productos,
      proximos_eventos,
    };
  }
}
