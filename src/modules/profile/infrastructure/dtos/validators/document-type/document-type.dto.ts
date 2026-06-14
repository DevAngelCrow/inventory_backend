import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class DocumentTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Passport' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Official travel document issued by a government' })
  description!: string;
  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'AAA-9999999', required: false })
  mask?: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  active!: boolean;
}
