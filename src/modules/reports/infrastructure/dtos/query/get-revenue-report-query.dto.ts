import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetRevenueReportQueryDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2023-01-01' })
  start_date!: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-31' })
  end_date!: string;
}
