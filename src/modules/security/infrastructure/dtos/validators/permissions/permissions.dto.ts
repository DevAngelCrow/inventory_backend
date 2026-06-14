import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class PermissionsRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Create User' })
  name!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id_category_permissions!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Allows creating a new user' })
  description!: string;
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
}
