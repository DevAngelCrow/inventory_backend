import { ApiProperty } from '@nestjs/swagger';
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

export class RecordDamageItemDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_product!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SCRATCH' })
  damage_type!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Rayón profundo en la superficie' })
  description!: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1 })
  quantity_affected!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 50.0 })
  charge_amount!: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  photo_url?: string;
}

export class RecordInspectionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id_reservation!: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-05T10:00:00Z' })
  inspection_date!: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'GOOD' })
  overall_condition!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'COMPLETED' })
  status!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordDamageItemDto)
  @IsOptional()
  @ApiProperty({ type: [RecordDamageItemDto], required: false })
  damage_items?: RecordDamageItemDto[];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  general_notes?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({ required: false })
  total_charges?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  id_inspected_by?: string;
}
