import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';
export { DimensionValuesDto } from './create-product.dto';
import { DimensionValuesDto } from './create-product.dto';

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
    if (value === null || value === undefined) return value;
    let obj = value;
    if (typeof value === 'string') {
      try {
        obj = JSON.parse(value);
      } catch {
        return value;
      }
    }
    if (typeof obj === 'object') {
      return plainToInstance(DimensionValuesDto, obj);
    }
    return obj;
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

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @ApiProperty({ example: true, required: false })
  active?: boolean;
}
