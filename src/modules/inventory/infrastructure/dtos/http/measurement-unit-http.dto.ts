import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { MeasurementUnitDto } from '@/modules/inventory/application/dtos/measurement-unit.dto';

export class MeasurementUnitHttpDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly active: boolean,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly status?: GlobalStatusDto,
  ) {}

  public static fromDto(dto: MeasurementUnitDto): MeasurementUnitHttpDto {
    return new MeasurementUnitHttpDto(
      dto.id,
      dto.name,
      dto.abbreviation,
      dto.active,
      dto.created_at,
      dto.updated_at,
      dto.status,
    );
  }
}

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
