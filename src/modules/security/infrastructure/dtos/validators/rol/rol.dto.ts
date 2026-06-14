import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class RolRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Administrator' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Role with full permissions' })
  description!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id_status!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @ApiProperty({ example: 'ADMIN' })
  code!: string;
  @IsArray()
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of permission IDs to assign to the role',
  })
  permissions_id?: string[];
}
