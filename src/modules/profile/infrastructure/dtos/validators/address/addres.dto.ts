import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Main St' })
  street!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: '123' })
  street_number!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Downtown' })
  neighborhood!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 45 })
  id_geographic_division!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'A1' })
  house_number!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'B' })
  block!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Pathway 9' })
  pathway!: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  current!: boolean;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  id_people!: string;
}
