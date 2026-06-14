import { GeographicDivisionActive } from '../value-objects/geographic-division-value-object/geographic-division-active';
import { GeographicDivisionDescription } from '../value-objects/geographic-division-value-object/geographic-division-description';
import { GeographicDivisionId } from '../value-objects/geographic-division-value-object/geographic-division-id';
import { GeographicDivisionIdCountry } from '../value-objects/geographic-division-value-object/geographic-division-id-country';
import { GeographicDivisionIdParent } from '../value-objects/geographic-division-value-object/geographic-division-id-parent';
import { GeographicDivisionIdType } from '../value-objects/geographic-division-value-object/geographic-division-id-type';
import { GeographicDivisionName } from '../value-objects/geographic-division-value-object/geographic-division-name';

export class GeographicDivision {
  constructor(
    private readonly name: GeographicDivisionName,
    private readonly description: GeographicDivisionDescription,
    private readonly id_country: GeographicDivisionIdCountry,
    private readonly id_type: GeographicDivisionIdType,
    private readonly active: GeographicDivisionActive,
    private readonly id_parent: GeographicDivisionIdParent,
    private readonly id?: GeographicDivisionId,
  ) {}

  static create(data: {
    id?: string;
    name: string;
    description?: string;
    id_country: string;
    id_type: string;
    active: boolean;
    id_parent?: string;
  }): GeographicDivision {
    return new GeographicDivision(
      new GeographicDivisionName(data.name),
      new GeographicDivisionDescription(data.description),
      new GeographicDivisionIdCountry(data.id_country),
      new GeographicDivisionIdType(data.id_type),
      new GeographicDivisionActive(data.active),
      new GeographicDivisionIdParent(data.id_parent),
      data.id ? new GeographicDivisionId(data.id) : undefined,
    );
  }

  public getId(): GeographicDivisionId | undefined {
    return this.id;
  }
  public getName(): GeographicDivisionName {
    return this.name;
  }
  public getDescription(): GeographicDivisionDescription {
    return this.description;
  }
  public getIdCountry(): GeographicDivisionIdCountry {
    return this.id_country;
  }
  public getIdType(): GeographicDivisionIdType {
    return this.id_type;
  }
  public getActive(): GeographicDivisionActive {
    return this.active;
  }
  public getIdParent(): GeographicDivisionIdParent {
    return this.id_parent;
  }
}
