import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class ProcessPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_reservation!: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id_payment_method!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'CASH' })
  payment_method_code!: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100.5 })
  amount!: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  id_currency!: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-01T10:00:00Z' })
  payment_date!: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'REF-12345', required: false })
  reference_number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Pago en efectivo', required: false })
  notes?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174003',
    required: false,
  })
  id_received_by?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174004',
    required: false,
  })
  id_invoice?: string;
}
