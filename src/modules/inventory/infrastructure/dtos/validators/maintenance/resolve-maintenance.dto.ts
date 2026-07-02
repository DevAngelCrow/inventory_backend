import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class ResolveMaintenanceDto {
  @IsDateString()
  @IsNotEmpty()
  date_end!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;
}
