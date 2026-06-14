import { CategoryStatus } from '../../domain/entities/category-status';

export class CategoryStatusDto {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
  ) {}
  public static fromEntity(categoryStatus: CategoryStatus): CategoryStatusDto {
    return new CategoryStatusDto(
      categoryStatus.getName().value(),
      categoryStatus.getCode().value(),
      categoryStatus.getDescription().value(),
      categoryStatus.getActive().value(),
      categoryStatus.getId() ? categoryStatus.getId()?.value() : undefined,
    );
  }
  public static fromDto(dto: CategoryStatusDto): CategoryStatusDto {
    return new CategoryStatusDto(
      dto.name,
      dto.code,
      dto.description,
      dto.active,
      dto.id,
    );
  }
}
