import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export type InspectionStatusType = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export class InspectionStatus {
  private readonly _value: InspectionStatusType;
  private readonly allowedStatuses: InspectionStatusType[] = [
    'PENDING',
    'COMPLETED',
    'CANCELLED',
  ];

  constructor(value: string) {
    if (!this.allowedStatuses.includes(value as InspectionStatusType)) {
      throw new InvalidValueObjectException(
        'InspectionStatus',
        'Invalid status value',
      );
    }
    this._value = value as InspectionStatusType;
  }

  public value(): InspectionStatusType {
    return this._value;
  }
}
