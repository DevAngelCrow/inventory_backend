import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceDto } from '../../../application/dtos/maintenance.dto';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';

export class MaintenanceHttpDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly cost: number | null;

  @ApiProperty()
  public readonly quantity: number;

  @ApiProperty()
  public readonly date_start: Date;

  @ApiProperty()
  public readonly date_end: Date | null;

  @ApiProperty()
  public readonly resolved: boolean;

  @ApiProperty()
  public readonly created_at: Date;

  @ApiProperty()
  public readonly updated_at: Date | null;

  @ApiProperty()
  public readonly id_product: string;

  @ApiProperty({ required: false })
  public readonly status?: GlobalStatusDto;

  constructor(
    id: string,
    description: string,
    cost: number | null,
    quantity: number,
    date_start: Date,
    date_end: Date | null,
    resolved: boolean,
    created_at: Date,
    updated_at: Date | null,
    id_product: string,
    status?: GlobalStatusDto,
  ) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.quantity = quantity;
    this.date_start = date_start;
    this.date_end = date_end;
    this.resolved = resolved;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.id_product = id_product;
    this.status = status;
  }

  public static fromDto(dto: MaintenanceDto): MaintenanceHttpDto {
    return new MaintenanceHttpDto(
      dto.id,
      dto.description,
      dto.cost,
      dto.quantity,
      dto.date_start,
      dto.date_end,
      dto.resolved,
      dto.created_at,
      dto.updated_at,
      dto.id_product,
      dto.status,
    );
  }
}
