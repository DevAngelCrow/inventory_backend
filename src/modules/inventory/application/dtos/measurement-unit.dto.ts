import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export class MeasurementUnitDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly active: boolean,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly status?: GlobalStatusDto,
  ) {}
}
