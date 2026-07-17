import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMeasurementUnitHttpDto {
  @ApiProperty({ example: 'Centimeter' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'cm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  abbreviation!: string;
}

export class UpdateMeasurementUnitHttpDto {
  @ApiProperty({ example: 'Centimeter' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'cm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  abbreviation!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active!: boolean;
}
