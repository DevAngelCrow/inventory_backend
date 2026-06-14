import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCategoryStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Category Status Name' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({ example: 'CS001' })
  code!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Description of category status' })
  description!: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  active!: boolean;
}
