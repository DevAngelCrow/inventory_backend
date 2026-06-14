import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCountryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Country Name' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'ES' })
  abbreviation!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: '123' })
  code!: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  active!: boolean;
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @ApiProperty({ example: 'ES' })
  iso2!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: '+34' })
  phone_code!: string;
}
