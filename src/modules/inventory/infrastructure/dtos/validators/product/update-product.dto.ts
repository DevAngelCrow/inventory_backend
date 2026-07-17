import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class DimensionValuesDto {
  @IsNumber()
  @Min(0)
  width!: number;

  @IsNumber()
  @Min(0)
  height!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depth?: number | null;

  @IsUUID()
  unitId!: string;
}

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'CHAIR-001' })
  sku!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ example: 'Silla Tiffany Blanca' })
  name!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ example: 10.5 })
  rental_price!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ example: 100 })
  total_stock!: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  category_id!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiProperty({ example: 'Silla blanca ideal para bodas', required: false })
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ example: 50.0, required: false })
  replacement_cost?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ example: 10, required: false })
  min_stock_alert?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({ example: 'Blanco', required: false })
  color?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionValuesDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  @ApiProperty({ example: '{"width":40,"height":40,"depth":90,"unitId":"uuid"}', required: false })
  dimensions?: DimensionValuesDto | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ example: 4.5, required: false })
  weight_lbs?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiProperty({ example: 'https://img.url', required: false })
  image_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Evitar dejar bajo la lluvia', required: false })
  notes?: string;
}
