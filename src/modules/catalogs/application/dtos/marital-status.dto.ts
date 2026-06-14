import { MaritalStatus } from '../../domain/entities/marital-status';

export class MaritalStatusDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly id?: string,
  ) {}
  public static fromEntity(maritalStatus: MaritalStatus): MaritalStatusDto {
    return new MaritalStatusDto(
      maritalStatus.getName().value(),
      maritalStatus.getDescription()?.value() ?? '',
      maritalStatus.getId() ? maritalStatus.getId()!.value() : undefined,
    );
  }
}
