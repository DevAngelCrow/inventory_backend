import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateMaintenanceDto {
  @IsUUID()
  @IsNotEmpty()
  id_product!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @IsDateString()
  @IsNotEmpty()
  date_start!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;
}
