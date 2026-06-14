import { GeographicDivisionTypeActive } from '../value-objects/geographic-division-type-value-object/geographic-division-type-active';
import { GeographicDivisionTypeId } from '../value-objects/geographic-division-type-value-object/geographic-division-type-id';
import { GeographicDivisionTypeIdCountry } from '../value-objects/geographic-division-type-value-object/geographic-division-type-id-country';
import { GeographicDivisionTypeLevel } from '../value-objects/geographic-division-type-value-object/geographic-division-type-level';
import { GeographicDivisionTypeName } from '../value-objects/geographic-division-type-value-object/geographic-division-type-name';

export class GeographicDivisionType {
  constructor(
    private readonly name: GeographicDivisionTypeName,
    private readonly level: GeographicDivisionTypeLevel,
    private readonly id_country: GeographicDivisionTypeIdCountry,
    private readonly active: GeographicDivisionTypeActive,
    private readonly id?: GeographicDivisionTypeId,
  ) {}

  static create(data: {
    id?: string;
    name: string;
    level: number;
    id_country: string;
    active: boolean;
  }): GeographicDivisionType {
    return new GeographicDivisionType(
      new GeographicDivisionTypeName(data.name),
      new GeographicDivisionTypeLevel(data.level),
      new GeographicDivisionTypeIdCountry(data.id_country),
      new GeographicDivisionTypeActive(data.active),
      data.id ? new GeographicDivisionTypeId(data.id) : undefined,
    );
  }

  public getId(): GeographicDivisionTypeId | undefined {
    return this.id;
  }
  public getName(): GeographicDivisionTypeName {
    return this.name;
  }
  public getLevel(): GeographicDivisionTypeLevel {
    return this.level;
  }
  public getIdCountry(): GeographicDivisionTypeIdCountry {
    return this.id_country;
  }
  public getActive(): GeographicDivisionTypeActive {
    return this.active;
  }
}
