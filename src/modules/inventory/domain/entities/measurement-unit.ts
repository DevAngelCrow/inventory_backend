import { AggregateRoot } from 'src/shared/domain/aggregate-root';
import { MeasurementUnitId } from '../value-objects/measurement-unit-value-object/measurement-unit-id';
import { MeasurementUnitName } from '../value-objects/measurement-unit-value-object/measurement-unit-name';
import { MeasurementUnitAbbreviation } from '../value-objects/measurement-unit-value-object/measurement-unit-abbreviation';
import { MeasurementUnitActive } from '../value-objects/measurement-unit-value-object/measurement-unit-active';

export class MeasurementUnit extends AggregateRoot {
  private _id: MeasurementUnitId;
  private _name: MeasurementUnitName;
  private _abbreviation: MeasurementUnitAbbreviation;
  private _active: MeasurementUnitActive;

  constructor(
    id: MeasurementUnitId,
    name: MeasurementUnitName,
    abbreviation: MeasurementUnitAbbreviation,
    active: MeasurementUnitActive,
  ) {
    super();
    this._id = id;
    this._name = name;
    this._abbreviation = abbreviation;
    this._active = active;
  }

  public get id(): MeasurementUnitId {
    return this._id;
  }

  public get name(): MeasurementUnitName {
    return this._name;
  }

  public get abbreviation(): MeasurementUnitAbbreviation {
    return this._abbreviation;
  }

  public get active(): MeasurementUnitActive {
    return this._active;
  }

  public static create(
    name: MeasurementUnitName,
    abbreviation: MeasurementUnitAbbreviation,
  ): MeasurementUnit {
    return new MeasurementUnit(
      new MeasurementUnitId(),
      name,
      abbreviation,
      new MeasurementUnitActive(true),
    );
  }

  public update(
    name: MeasurementUnitName,
    abbreviation: MeasurementUnitAbbreviation,
    active: MeasurementUnitActive,
  ): void {
    this._name = name;
    this._abbreviation = abbreviation;
    this._active = active;
  }
}
