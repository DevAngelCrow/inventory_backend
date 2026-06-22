import { ApiProperty } from '@nestjs/swagger';

class ReservasMetric {
  @ApiProperty()
  hoy!: number;
  @ApiProperty()
  semana!: number;
  @ApiProperty()
  mes!: number;
}

class IngresosMetric {
  @ApiProperty()
  hoy!: number;
  @ApiProperty()
  semana!: number;
  @ApiProperty()
  mes!: number;
}

class LogisticaMetric {
  @ApiProperty()
  en_progreso!: number;
  @ApiProperty()
  finalizadas!: number;
  @ApiProperty()
  en_mantenimiento!: number;
}

class CuentasPorCobrarMetric {
  @ApiProperty()
  balance_pendiente!: number;
  @ApiProperty()
  facturas_draft!: number;
}

class TopProductoMetric {
  @ApiProperty()
  nombre!: string;
  @ApiProperty()
  cantidad!: number;
}

class ProximoEventoMetric {
  @ApiProperty()
  cliente!: string;
  @ApiProperty()
  direccion!: string;
  @ApiProperty()
  fecha!: string;
  @ApiProperty()
  tipo!: string;
}

export class DashboardSummaryHttpDto {
  @ApiProperty({ type: ReservasMetric })
  reservas!: ReservasMetric;

  @ApiProperty({ type: IngresosMetric })
  ingresos!: IngresosMetric;

  @ApiProperty({ type: LogisticaMetric })
  logistica!: LogisticaMetric;

  @ApiProperty({ type: CuentasPorCobrarMetric })
  cuentas_por_cobrar!: CuentasPorCobrarMetric;

  @ApiProperty({ type: [TopProductoMetric] })
  top_productos!: TopProductoMetric[];

  @ApiProperty({ type: [ProximoEventoMetric] })
  proximos_eventos!: ProximoEventoMetric[];
}
