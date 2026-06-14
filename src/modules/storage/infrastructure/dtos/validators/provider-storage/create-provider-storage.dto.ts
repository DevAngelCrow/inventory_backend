import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProviderStorageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'AWS S3' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @ApiProperty({ example: 'aws_s3' })
  code!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Amazon Web Services S3 storage provider' })
  description!: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  active!: boolean;
}
