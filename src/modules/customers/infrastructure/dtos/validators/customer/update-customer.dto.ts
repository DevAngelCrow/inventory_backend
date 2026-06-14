import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Juan' })
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Pérez' })
  last_name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ example: '+1234567890' })
  phone!: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'juan.perez@example.com', required: false })
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({ example: '+1098765432', required: false })
  phone_secondary?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ example: 'Eventos JP', required: false })
  company_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({ example: 'RFC12345678', required: false })
  tax_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ example: 'Calle Falsa 123', required: false })
  address_line1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ example: 'Apt 4B', required: false })
  address_line2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ example: 'Springfield', required: false })
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ example: 'IL', required: false })
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({ example: '12345', required: false })
  zip_code?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Cliente VIP', required: false })
  notes?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  id_user?: string;
}
