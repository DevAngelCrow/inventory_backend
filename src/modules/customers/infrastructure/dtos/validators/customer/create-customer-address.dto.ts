import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCustomerAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'Principal' })
  label!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Calle Falsa 123' })
  address_line1!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ example: 'Apt 4B', required: false })
  address_line2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({ example: '12345', required: false })
  zip_code?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  is_primary?: boolean;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  id_geographic_division?: string;
}
