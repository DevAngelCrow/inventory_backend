import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateGlobalStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Active' })
  name!: string;
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Indicates if the status is active or not' })
  description!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Status' })
  code!: string;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({ example: '#FFFFFF' })
  state_color!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({ example: '#000000' })
  text_color!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id_category_status!: string;
}
