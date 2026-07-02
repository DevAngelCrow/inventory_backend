import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export class MaintenanceDto {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly cost: number | null,
    public readonly quantity: number,
    public readonly date_start: Date,
    public readonly date_end: Date | null,
    public readonly resolved: boolean,
    public readonly created_at: Date | null,
    public readonly updated_at: Date | null,
    public readonly id_product: string,
    public readonly status?: GlobalStatusDto,
  ) {}
}
