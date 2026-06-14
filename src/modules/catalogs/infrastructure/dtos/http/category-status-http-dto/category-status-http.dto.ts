import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { CategoryStatus } from 'src/modules/catalogs/domain/entities/category-status';

export class CategoryStatusHttpDto {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(
    categoryStatus: CategoryStatus,
  ): CategoryStatusHttpDto {
    return new CategoryStatusHttpDto(
      categoryStatus.getName().value(),
      categoryStatus.getCode().value(),
      categoryStatus.getDescription().value(),
      categoryStatus.getActive().value(),
      categoryStatus.getId() ? categoryStatus.getId()?.value() : undefined,
    );
  }
  public static fromDto(
    categoryStatusDto: CategoryStatusHttpDto,
  ): CategoryStatusHttpDto {
    return new CategoryStatusHttpDto(
      categoryStatusDto.name,
      categoryStatusDto.code,
      categoryStatusDto.description,
      categoryStatusDto.active,
      categoryStatusDto.id,
      categoryStatusDto.status,
    );
  }
}
