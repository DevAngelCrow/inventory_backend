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

export class GenerateInvoiceLineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Alquiler de sillas' })
  description!: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 10 })
  quantity!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 5.0 })
  unit_price!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 50.0 })
  subtotal!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 5.0 })
  tax_amount!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 55.0 })
  total!: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  id_product?: string;
}

export class GenerateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_reservation!: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id_customer!: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  id_currency!: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-06T10:00:00Z' })
  issue_date!: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({ required: false })
  due_date?: Date;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 50.0 })
  subtotal!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0.1 })
  tax_rate!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 5.0 })
  tax_amount!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0.0 })
  discount_amount!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0.0 })
  delivery_fee!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 0.0 })
  damage_charges!: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 55.0 })
  total!: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'ISSUED', required: false })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  notes?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  id_created_by?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenerateInvoiceLineDto)
  @ApiProperty({ type: [GenerateInvoiceLineDto] })
  lines!: GenerateInvoiceLineDto[];
}
