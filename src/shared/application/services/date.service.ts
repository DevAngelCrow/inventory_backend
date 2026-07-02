import { Injectable, Inject } from '@nestjs/common';
import { IDateProvider } from '../../infrastructure/interfaces/date-provider.interface';

@Injectable()
export class DateService {
  constructor(
    @Inject(IDateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  now(): Date {
    return this.dateProvider.now();
  }

  getStartOf(unit: 'day' | 'week' | 'month'): Date {
    return this.dateProvider.startOf(unit);
  }

  getEndOf(unit: 'day' | 'week' | 'month'): Date {
    return this.dateProvider.endOf(unit);
  }

  getEndOfDayWithOffset(days: number): Date {
    return this.dateProvider.endOfDayWithOffset(days);
  }

  format(date: Date, template: string): string {
    return this.dateProvider.format(date, template);
  }
}
