import { RevenueReportResult } from '../queries/get-revenue-report.handler';

export const REPORTS_READ_REPOSITORY = Symbol('REPORTS_READ_REPOSITORY');

export interface DashboardDateParams {
  todayStart: Date;
  todayEnd: Date;
  weekStart: Date;
  weekEnd: Date;
  monthStart: Date;
  monthEnd: Date;
  tomorrowEnd: Date;
}

export interface TopProductRaw {
  nombre: string;
  cantidad: number;
}

export interface UpcomingEventRaw {
  first_name: string;
  last_name: string;
  delivery_address: string | null;
  event_start: Date;
}

export interface DashboardRawData {
  reservasHoy: number;
  reservasSemana: number;
  reservasMes: number;
  ingresosHoy: number;
  ingresosSemana: number;
  ingresosMes: number;
  enProgreso: number;
  finalizadas: number;
  enMantenimiento: number;
  balancePendiente: number;
  facturasDraft: number;
  top_productos: TopProductRaw[];
  eventosRaw: UpcomingEventRaw[];
}

export interface IReportsReadRepository {
  getRevenueSummary(startDate: Date, endDate: Date): Promise<{ totalRevenue: number; totalInvoices: number }>;
  getDashboardSummaryData(dates: DashboardDateParams): Promise<DashboardRawData>;
}
