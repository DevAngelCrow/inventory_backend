import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateGeographicDivisionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'San Salvador' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Departamento de San Salvador', required: false })
  description?: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  id_country!: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: '00000000-0000-4000-9000-000000000001' })
  id_type!: string;

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({ example: null, required: false })
  id_parent?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
}
