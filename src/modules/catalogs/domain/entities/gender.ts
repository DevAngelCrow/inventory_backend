import { GenderId } from '../value-objects/gender-value-object/gender-id';
import { GenderName } from '../value-objects/gender-value-object/gender-name';

export class Gender {
  constructor(
    private readonly name: GenderName,
    private readonly id?: GenderId,
  ) {}
  static create(data: { id?: string; name: string }): Gender {
    return new Gender(
      new GenderName(data.name),
      data.id ? new GenderId(data.id) : undefined,
    );
  }
  public getId(): GenderId | undefined {
    return this.id;
  }
  public getName(): GenderName {
    return this.name;
  }
}
