export const IDateProvider = Symbol('IDateProvider');

export interface IDateProvider {
  now(): Date;
  startOf(unit: 'day' | 'week' | 'month'): Date;
  endOf(unit: 'day' | 'week' | 'month'): Date;
  addDays(days: number): Date;
  endOfDayWithOffset(days: number): Date;
  format(date: Date, template: string): string;
}
