import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDashboardSummaryQuery } from './get-dashboard-summary.query';
import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto';
import { DateService } from '@/shared/application/services/date.service';
import { Inject } from '@nestjs/common';
import {
  IReportsReadRepository,
  REPORTS_READ_REPOSITORY,
} from '../repositories/reports-read.repository';

@QueryHandler(GetDashboardSummaryQuery)
export class GetDashboardSummaryHandler implements IQueryHandler<GetDashboardSummaryQuery> {
  constructor(
    @Inject(REPORTS_READ_REPOSITORY)
    private readonly reportsReadRepository: IReportsReadRepository,
    private readonly dateService: DateService,
  ) {}

  async execute(query: GetDashboardSummaryQuery): Promise<DashboardSummaryDto> {
    const todayStart = this.dateService.getStartOf('day');
    const todayEnd = this.dateService.getEndOf('day');
    const weekStart = this.dateService.getStartOf('week');
    const weekEnd = this.dateService.getEndOf('week');
    const monthStart = this.dateService.getStartOf('month');
    const monthEnd = this.dateService.getEndOf('month');
    const tomorrowEnd = this.dateService.getEndOfDayWithOffset(1);

    const data = await this.reportsReadRepository.getDashboardSummaryData({
      todayStart,
      todayEnd,
      weekStart,
      weekEnd,
      monthStart,
      monthEnd,
      tomorrowEnd,
    });

    const proximos_eventos = data.eventosRaw.map((ev) => ({
      cliente: `${ev.first_name} ${ev.last_name}`,
      direccion: ev.delivery_address || 'Recogida en tienda',
      fecha: this.dateService.format(ev.event_start, 'DD/MM/YYYY HH:mm'),
      tipo: ev.delivery_address ? 'ENTREGA' : 'RECOLECCION',
    }));

    return {
      reservas: {
        hoy: data.reservasHoy,
        semana: data.reservasSemana,
        mes: data.reservasMes,
      },
      ingresos: {
        hoy: data.ingresosHoy,
        semana: data.ingresosSemana,
        mes: data.ingresosMes,
      },
      logistica: {
        en_progreso: data.enProgreso,
        finalizadas: data.finalizadas,
        en_mantenimiento: data.enMantenimiento,
      },
      cuentas_por_cobrar: {
        balance_pendiente: data.balancePendiente,
        facturas_draft: data.facturasDraft,
      },
      top_productos: data.top_productos,
      proximos_eventos,
    };
  }
}
