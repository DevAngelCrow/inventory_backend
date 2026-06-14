import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CategoryPermissionsRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Admin' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Category for admin permissions' })
  description!: string;
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
}
