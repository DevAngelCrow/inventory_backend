import { GeographicDivisionType } from '../../domain/entities/geographic-division-type';

export class GeographicDivisionTypeDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly level: number,
    public readonly id_country: string,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly country?: T,
    public readonly status?: unknown,
  ) {}

  public static fromEntity(
    entity: GeographicDivisionType,
  ): GeographicDivisionTypeDto {
    return new GeographicDivisionTypeDto(
      entity.getName().value(),
      entity.getLevel().value(),
      entity.getIdCountry().value(),
      entity.getActive().value(),
      entity.getId()?.value(),
    );
  }

  public static fromDto<T>(
    dto: GeographicDivisionTypeDto<T>,
  ): GeographicDivisionTypeDto<T> {
    return new GeographicDivisionTypeDto(
      dto.name,
      dto.level,
      dto.id_country,
      dto.active,
      dto.id,
      dto.country,
      dto.status,
    );
  }
}
