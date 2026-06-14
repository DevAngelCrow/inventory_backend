import { GeographicDivision } from '../../domain/entities/geographic-division';

export class GeographicDivisionDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly id_country: string,
    public readonly id_type: string,
    public readonly active: boolean,
    public readonly id_parent?: string | undefined,
    public readonly id?: string,
    public readonly parent?: T,
    public readonly type?: unknown,
    public readonly country?: unknown,
    public readonly status?: unknown,
  ) {}

  public static fromEntity(entity: GeographicDivision): GeographicDivisionDto {
    return new GeographicDivisionDto(
      entity.getName().value(),
      entity.getDescription().value(),
      entity.getIdCountry().value(),
      entity.getIdType().value(),
      entity.getActive().value(),
      entity.getIdParent().value() ?? undefined,
      entity.getId()?.value(),
    );
  }

  public static fromDto<T>(
    dto: GeographicDivisionDto<T>,
  ): GeographicDivisionDto<T> {
    return new GeographicDivisionDto(
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
