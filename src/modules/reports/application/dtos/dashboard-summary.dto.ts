export class ReservasMetricDto {
  hoy!: number;
  semana!: number;
  mes!: number;
}

export class IngresosMetricDto {
  hoy!: number;
  semana!: number;
  mes!: number;
}

export class LogisticaMetricDto {
  en_progreso!: number;
  finalizadas!: number;
  en_mantenimiento!: number;
}

export class CuentasPorCobrarMetricDto {
  balance_pendiente!: number;
  facturas_draft!: number;
}

export class TopProductoMetricDto {
  nombre!: string;
  cantidad!: number;
}

export class ProximoEventoMetricDto {
  cliente!: string;
  direccion!: string;
  fecha!: string;
  tipo!: string;
}

export class DashboardSummaryDto {
  reservas!: ReservasMetricDto;
  ingresos!: IngresosMetricDto;
  logistica!: LogisticaMetricDto;
  cuentas_por_cobrar!: CuentasPorCobrarMetricDto;
  top_productos!: TopProductoMetricDto[];
  proximos_eventos!: ProximoEventoMetricDto[];
}
