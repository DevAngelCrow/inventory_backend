import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { GlobalStatus } from 'src/modules/catalogs/domain/entities/global-status';

export class GlobalStatusHttpDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly code: string,
    public readonly active: boolean,
    public readonly state_color: string,
    public readonly text_color: string,
    public readonly id_category_status: string,
    public readonly id?: string,
    public readonly category_status?: T,
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(globalStatus: GlobalStatus): GlobalStatusHttpDto {
    return new GlobalStatusHttpDto(
      globalStatus.getName().value(),
      globalStatus.getDescription().value(),
      globalStatus.getCode().value(),
      globalStatus.getActive().value(),
      globalStatus.getStateColor().value(),
      globalStatus.getTextColor().value(),
      globalStatus.getIdCategoryStatus().value(),
      globalStatus.getId() ? globalStatus.getId()?.value() : undefined,
    );
  }
  public static fromDto<T>(
    dto: GlobalStatusHttpDto<T>,
  ): GlobalStatusHttpDto<T> {
    return new GlobalStatusHttpDto(
      dto.name,
      dto.description,
      dto.code,
      dto.active,
      dto.state_color,
      dto.text_color,
      dto.id_category_status,
      dto.id,
      dto.category_status,
      dto.status,
    );
  }
}
