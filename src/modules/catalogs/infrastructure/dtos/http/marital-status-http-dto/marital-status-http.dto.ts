import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { MaritalStatus } from 'src/modules/catalogs/domain/entities/marital-status';

export class MaritalStatusHttpDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly id?: string,
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(maritalStatus: MaritalStatus): MaritalStatusHttpDto {
    return new MaritalStatusHttpDto(
      maritalStatus.getName().value(),
      maritalStatus.getDescription()?.value() || '',
      maritalStatus.getId() ? maritalStatus.getId()?.value() : undefined,
    );
  }
  public static fromDto(dto: MaritalStatusHttpDto): MaritalStatusHttpDto {
    return new MaritalStatusHttpDto(
      dto.name,
      dto.description,
      dto.id,
      dto.status,
    );
  }
}
