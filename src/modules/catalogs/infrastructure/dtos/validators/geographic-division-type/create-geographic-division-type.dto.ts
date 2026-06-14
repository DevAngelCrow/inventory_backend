import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGeographicDivisionTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Departamento' })
  name!: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  level!: number;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  id_country!: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
}
