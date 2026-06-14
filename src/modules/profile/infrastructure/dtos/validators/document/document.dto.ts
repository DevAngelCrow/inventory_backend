import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'AB1234567' })
  number_document!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Passport issued by country X' })
  description!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  id_people!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  id_type_document!: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  active!: boolean;
}
