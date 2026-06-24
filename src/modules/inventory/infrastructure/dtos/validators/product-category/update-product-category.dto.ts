import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Chairs' })
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ example: 'All types of chairs for events', required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ example: 'chair', required: false })
  icon?: string;
}
