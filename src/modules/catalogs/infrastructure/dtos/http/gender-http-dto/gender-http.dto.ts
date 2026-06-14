import { Gender } from '@/modules/catalogs/domain/entities/gender';

//import { District } from '../../domain/entities/district';
export class GenderHttpDto {
  constructor(
    public readonly name: string,
    public readonly id?: string,
  ) {}
  public static fromEntity(gender: Gender): GenderHttpDto {
    return new GenderHttpDto(
      gender.getName().value(),
      gender.getId() ? gender.getId()!.value() : undefined,
    );
  }
  public static fromDto(dto: GenderHttpDto): GenderHttpDto {
    return new GenderHttpDto(dto.name, dto.id);
  }
}
