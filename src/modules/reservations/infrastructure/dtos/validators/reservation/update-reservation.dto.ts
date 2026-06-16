import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateReservationItemDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_product!: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 2 })
  quantity!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 10.5 })
  unit_price!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 21.0 })
  total_price!: number;
}

export class UpdateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_customer!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'DRAFT' })
  status!: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-01T10:00:00Z' })
  event_start!: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-05T10:00:00Z' })
  event_end!: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Calle Principal 123', required: false })
  delivery_address?: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100.0 })
  total_amount!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ example: 50.0, required: false })
  deposit_amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ example: 50.0, required: false })
  balance_due?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Entregar en la puerta trasera', required: false })
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReservationItemDto)
  @ApiProperty({ type: [UpdateReservationItemDto] })
  items!: UpdateReservationItemDto[];
}
