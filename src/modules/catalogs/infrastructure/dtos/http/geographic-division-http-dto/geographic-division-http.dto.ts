import { GeographicDivisionDto } from '@/modules/catalogs/application/dtos/geographic-division.dto';
import { GeographicDivision } from 'src/modules/catalogs/domain/entities/geographic-division';

export class GeographicDivisionHttpDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly id_country: string,
    public readonly id_type: string,
    public readonly active: boolean,
    public readonly id_parent: string | undefined,
    public readonly id?: string,
    public readonly parent?: T,
    public readonly type?: unknown,
    public readonly country?: unknown,
    public readonly status?: unknown,
  ) {}

  public static fromEntity(
    entity: GeographicDivision,
  ): GeographicDivisionHttpDto {
    return new GeographicDivisionHttpDto(
      entity.getName().value(),
      entity.getDescription().value(),
      entity.getIdCountry().value(),
      entity.getIdType().value(),
      entity.getActive().value(),
      entity.getIdParent().value(),
      entity.getId()?.value(),
    );
  }

  public static fromDto<T>(
    dto: GeographicDivisionDto<T>,
  ): GeographicDivisionHttpDto<T> {
    return new GeographicDivisionHttpDto(
      dto.name,
      dto.description,
      dto.id_country,
      dto.id_type,
      dto.active,
      dto.id_parent,
      dto.id,
      dto.parent,
      dto.type,
      dto.country,
      dto.status,
    );
  }
}
