import { Global, Module } from '@nestjs/common';
import { IDateProvider } from '../interfaces/date-provider.interface';
import { DayjsDateAdapter } from './dayjs-date.adapter';
import { DateService } from '../../application/services/date.service';

@Global()
@Module({
  providers: [
    {
      provide: IDateProvider,
      useClass: DayjsDateAdapter,
    },
    DateService,
  ],
  exports: [DateService],
})
export class DateModule {}
