import { Injectable } from '@nestjs/common';
import { IDateProvider } from '../interfaces/date-provider.interface';
import dayjs from 'dayjs';

@Injectable()
export class DayjsDateAdapter implements IDateProvider {
  now(): Date {
    return dayjs().toDate();
  }
  startOf(unit: 'day' | 'week' | 'month'): Date {
    return dayjs().startOf(unit).toDate();
  }
  endOf(unit: 'day' | 'week' | 'month'): Date {
    return dayjs().endOf(unit).toDate();
  }
  addDays(days: number): Date {
    return dayjs().add(days, 'day').toDate();
  }
  endOfDayWithOffset(days: number): Date {
    return dayjs().add(days, 'day').endOf('day').toDate();
  }
  format(date: Date, template: string): string {
    return dayjs(date).format(template);
  }
}
