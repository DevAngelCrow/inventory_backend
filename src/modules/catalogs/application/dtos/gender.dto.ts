//import { District } from '../../domain/entities/district';
import { Gender } from '../../domain/entities/gender';

export class GenderDto {
  constructor(
    public readonly name: string,
    public readonly id?: string,
  ) {}
  public static fromEntity(gender: Gender): GenderDto {
    return new GenderDto(
      gender.getName().value(),
      gender.getId() ? gender.getId()!.value() : undefined,
    );
  }
  public static fromDto(dto: GenderDto): GenderDto {
    return new GenderDto(dto.name, dto.id);
  }
}
