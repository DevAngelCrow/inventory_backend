import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomerAddressDto } from './create-customer-address.dto';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Juan' })
  first_name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'Carlos', required: false })
  middle_name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Pérez' })
  last_name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'Formato de teléfono inválido',
  })
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
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'Formato de teléfono secundario inválido',
  })
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
  @ApiProperty({ example: 'Cliente VIP', required: false })
  notes?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_country!: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerAddressDto)
  @ApiProperty({ type: [CreateCustomerAddressDto], required: false })
  addresses?: CreateCustomerAddressDto[];
}
