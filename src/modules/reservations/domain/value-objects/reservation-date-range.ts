import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';

export class ReservationDateRange {
  private readonly _start: Date;
  private readonly _end: Date;

  constructor(start: Date, end: Date) {
    if (!(start instanceof Date) || isNaN(start.getTime())) {
      throw new InvalidValueObjectException('ReservationStartDate', 'Invalid date');
    }
    if (!(end instanceof Date) || isNaN(end.getTime())) {
      throw new InvalidValueObjectException('ReservationEndDate', 'Invalid date');
    }
    if (start >= end) {
      throw new InvalidValueObjectException('ReservationDateRange', 'Start date must be before end date');
    }
    this._start = start;
    this._end = end;
  }

  public get start(): Date { return this._start; }
  public get end(): Date { return this._end; }
}
